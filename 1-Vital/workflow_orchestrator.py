#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Workflow Orchestrator - Accepts JSON parameters and runs the complete workflow
This script is called by the smartikle Node.js backend to trigger content creation
"""

import os
import sys
import json
import argparse
import subprocess
import signal
from pathlib import Path
from datetime import datetime

# Global flag for graceful shutdown
CANCEL_REQUESTED = False

def signal_handler(signum, frame):
    """Handle SIGTERM/SIGINT for graceful shutdown"""
    global CANCEL_REQUESTED
    print("\n[CANCEL] Workflow cancellation requested")
    CANCEL_REQUESTED = True
    sys.exit(1)

# Register signal handlers
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("[OK] Environment variables loaded from .env")
except ImportError:
    print("[WARN] python-dotenv not installed. Install with: pip install python-dotenv")
except Exception as e:
    print(f"[WARN] Could not load .env file: {e}")

def update_status(status_file, step, total_steps=4, status="running", error=None):
    """Update the status file for real-time progress tracking"""
    try:
        status_data = {
            "currentStep": step,
            "totalSteps": total_steps,
            "status": status,
            "updatedAt": datetime.now().isoformat()
        }
        if error:
            status_data["error"] = error

        with open(status_file, 'w') as f:
            json.dump(status_data, f, indent=2)
        print(f"[OK] Status updated: Step {step}/{total_steps}")
    except Exception as e:
        print(f"[WARN] Failed to update status: {e}")


def run_step(step_number, script_name, status_file, params_file, use_date_file=True):
    """Run a single workflow step"""
    print(f"\n{'='*60}")
    print(f"STEP {step_number}: {script_name}")
    print(f"{'='*60}\n")

    update_status(status_file, step_number, status="running")

    cmd = ["python", script_name]
    if use_date_file:
        cmd.append("--use-date-file")

    # Set environment variable so step script knows which params file to use
    env = os.environ.copy()
    env['WORKFLOW_PARAMS_FILE'] = params_file

    try:
        result = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            env=env  # Pass environment with unique params file
        )
        print(result.stdout)
        if result.stderr:
            print(f"Warnings: {result.stderr}")
        print(f"[OK] Step {step_number} completed successfully\n")
        return True
    except subprocess.CalledProcessError as e:
        error_msg = f"Step {step_number} failed: {e.stderr or e.stdout or str(e)}"
        print(f"[FAIL] {error_msg}")
        update_status(status_file, step_number, status="error", error=error_msg)
        raise Exception(error_msg)


def create_workflow_params_file(params, workflow_id):
    """
    Create a workflow-specific parameters file
    This ensures concurrent workflows don't interfere with each other
    """
    # Use workflow ID in filename to avoid conflicts between concurrent workflows
    params_file = f"workflow_params_{workflow_id}.json"
    with open(params_file, 'w') as f:
        json.dump(params, f, indent=2)
    print(f"[OK] Parameters saved to {params_file}")
    return params_file


def save_selected_date(date_str):
    """Save the lesson date to selected_date.txt for workflow scripts"""
    with open("selected_date.txt", 'w') as f:
        f.write(date_str)
    print(f"[OK] Selected date saved: {date_str}")


def extract_youtube_url(output_folder):
    """Extract YouTube URL from the upload output"""
    youtube_url = None
    try:
        # Look for YouTube URL in various possible locations
        possible_files = [
            os.path.join(output_folder, "youtube_url.txt"),
            os.path.join(output_folder, "youtubetitle.txt")
        ]

        for file_path in possible_files:
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    content = f.read()
                    # Extract URL if it contains youtu
                    if 'youtu' in content:
                        youtube_url = content.strip()
                        break
    except Exception as e:
        print(f"[WARN] Could not extract YouTube URL: {e}")

    return youtube_url


def extract_article_text(output_folder):
    """Extract article text from the essay document"""
    article_text = ""
    try:
        from docx import Document
        essay_file = os.path.join(output_folder, "essay_short.docx")
        if os.path.exists(essay_file):
            doc = Document(essay_file)
            article_text = "\n\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        print(f"[WARN] Could not extract article text: {e}")

    return article_text


def extract_quiz_data(output_folder):
    """Extract quiz data from quiz_data.json"""
    quiz_data = None
    try:
        quiz_file = os.path.join(output_folder, "quiz_data.json")
        if os.path.exists(quiz_file):
            with open(quiz_file, 'r', encoding='utf-8') as f:
                quiz_data = json.load(f)
            print(f"[OK] Quiz data loaded: {len(quiz_data.get('questions', []))} questions")
    except Exception as e:
        print(f"[WARN] Could not extract quiz data: {e}")

    return quiz_data


def main():
    parser = argparse.ArgumentParser(description='Workflow Orchestrator')
    parser.add_argument('--params', required=True, help='Path to JSON parameters file')
    parser.add_argument('--status-file', required=True, help='Path to status JSON file')
    parser.add_argument('--workflow-id', required=True, help='Workflow ID')
    parser.add_argument('--start-step', type=int, default=1, help='Step to start from (1-4)')

    args = parser.parse_args()

    print(f"""
================================================================
         WORKFLOW ORCHESTRATOR - Content Creation Pipeline
                    Workflow ID: {args.workflow_id[:16]}...
================================================================
""")

    try:
        # Load parameters
        with open(args.params, 'r') as f:
            params = json.load(f)

        print("Parameters loaded:")
        print(f"  Topic: {params['topic']}")
        print(f"  Slug: {params['slug']}")
        print(f"  Date: {params['lessonDate']}")
        print(f"  Reading Length: {params['readingLength']}s")
        print()

        # Create workflow parameters file for Python scripts
        # Use workflow ID to ensure concurrent workflows don't conflict
        params_filename = create_workflow_params_file(params, args.workflow_id)

        # Determine output folder path
        # This should match the folder structure created by STEP 1
        # Use path relative to this script's location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        root_folder = os.path.join(script_dir, "Course_Collective")
        # Use slug as folder name (e.g., WED26-2026-01-15-23-37-49)
        folder_name = params['slug']
        output_folder = os.path.join(root_folder, folder_name, "output")

        # Run workflow steps
        steps = [
            ("00_STEP1_Nasean_Create_Essay_WebParams_V8.py", False),  # Uses workflow_params.json
            ("12_STEP2_Nasean_Generate_Image_WebParams_V8.py", False),  # Web version - no Google Sheets
            ("13_STEP3_Nasean_Create_NarrationMP4_WebParams_V9.py", False),  # Web version - no Google Sheets
            ("14_STEP4_Nasean_YOUTUBE_FFMPEG_Create_Final_Video_WebParams_V9.py", False),  # Web version - no Google Sheets
            # YouTube upload is optional - skip for web workflow
            # ("15_STEP5_Nasean_youtube_UPLOADER_v1.py", True),
        ]

        # Start from specified step (default is 1)
        start_step = args.start_step
        if start_step > 1:
            print(f"\n[RESUME] Starting from step {start_step}")

        for idx, (script, use_date) in enumerate(steps, start=1):
            # Skip steps before start_step
            if idx < start_step:
                print(f"[SKIP] Step {idx} already completed")
                continue

            # Check for cancellation before starting each step
            if CANCEL_REQUESTED:
                print(f"[CANCEL] Workflow cancelled before step {idx}")
                update_status(args.status_file, idx, status="cancelled", error="Cancelled by user")
                sys.exit(1)

            run_step(idx, script, args.status_file, params_filename, use_date)

            # Check for cancellation after each step
            if CANCEL_REQUESTED:
                print(f"[CANCEL] Workflow cancelled after step {idx}")
                update_status(args.status_file, idx, status="cancelled", error="Cancelled by user")
                sys.exit(1)

        # Extract output data
        print(f"\n{'='*60}")
        print("Extracting output data...")
        print(f"{'='*60}\n")

        youtube_url = extract_youtube_url(output_folder)
        article_text = extract_article_text(output_folder)
        quiz_data = extract_quiz_data(output_folder)

        # Save output for Node.js backend
        output_data = {
            "success": True,
            "workflowId": args.workflow_id,
            "youtubeUrl": youtube_url or "https://youtube.com/placeholder",
            "articleText": article_text or "Article text could not be extracted",
            "thumbnailUrl": f"/images/{params['slug']}.png",  # Thumbnail created by Step 2
            "quizData": quiz_data,  # Include quiz data for smartikle
            "metadata": {
                "topic": params['topic'],
                "slug": params['slug'],
                "outputFolder": output_folder
            }
        }

        output_file = args.params.replace('_params.json', '_output.json')
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)

        print(f"[OK] Output saved to {output_file}")
        print(f"[OK] YouTube URL: {youtube_url}")

        # Mark as completed
        update_status(args.status_file, 4, status="completed")

        print(f"""
================================================================
                  WORKFLOW COMPLETED SUCCESSFULLY
================================================================
""")

    except Exception as e:
        print(f"""
================================================================
                     WORKFLOW FAILED
  Error: {str(e)[:54]}
================================================================
""")
        update_status(args.status_file, 0, status="error", error=str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
