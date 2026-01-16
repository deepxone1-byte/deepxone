#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
STEP 3: Create Narration Video (Web Parameters Version)
This version accepts parameters from workflow_params.json instead of Google Sheets
"""

import sys
import io

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Load environment variables from .env file first
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("[OK] Environment variables loaded from .env")
except ImportError:
    print("[WARN] python-dotenv not installed")
except Exception as e:
    print(f"[WARN] Could not load .env file: {e}")

import subprocess
import os
import ffmpeg
import sys
import json
import configparser
from pathlib import Path
from datetime import datetime

# === Load config ===
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/13_STEP3_Nasean_Create_Nasean_NarrationMP4_vertical.txt")

ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"
FRAME_RATE = config.getint("DEFAULT", "FRAME_RATE")
VIDEO_CODEC = config.get("DEFAULT", "VIDEO_CODEC")
PIX_FMT = config.get("DEFAULT", "PIX_FMT")


def load_workflow_params():
    """Load parameters from workflow-specific params file"""
    # Check for workflow-specific params file (for concurrent execution support)
    params_file = os.getenv('WORKFLOW_PARAMS_FILE', 'workflow_params.json')

    if not os.path.exists(params_file):
        print(f"[ERROR] Workflow parameters file not found: {params_file}")
        sys.exit(1)

    with open(params_file, 'r') as f:
        params = json.load(f)

    print("[INFO] Workflow Parameters:")
    print(f"  Topic: {params['topic']}")
    print(f"  Slug: {params['slug']}")
    print(f"  Date: {params['lessonDate']}")
    print(f"  Params file: {params_file}")
    print()

    return params


def main():
    print("\n" + "="*60)
    print("STEP 3: Create Narration Video")
    print("="*60 + "\n")

    # Load workflow parameters
    params = load_workflow_params()

    # Use slug as folder name (e.g., WED26-2026-01-15-23-37-49)
    folder_name = params['slug']

    print(f"[INFO] Processing folder: {folder_name}")

    # Get video format from params (default to landscape)
    video_format = params.get('videoFormat', 'landscape')
    print(f"[INFO] Video format: {video_format}")

    # Determine video dimensions and background based on format
    format_config = {
        'landscape': {
            'width': 1920,
            'height': 1080,
            'background': 'background.jpg',
            'output': 'narration.mp4'
        },
        'portrait': {
            'width': 1080,
            'height': 1920,
            'background': 'backgroundv.jpg',
            'output': 'narration_vertical.mp4'
        },
        'square': {
            'width': 1080,
            'height': 1080,
            'background': 'background.jpg',  # Use landscape, will be cropped to square
            'output': 'narration_square.mp4'
        }
    }

    config_data = format_config.get(video_format, format_config['landscape'])
    video_width = config_data['width']
    video_height = config_data['height']
    background_file = config_data['background']
    output_filename = config_data['output']

    output_folder = ROOT_FOLDER / folder_name / "output"
    audio_file = output_folder / "narration_short.mp3"
    image_file = ROOT_FOLDER / background_file
    output_video = output_folder / output_filename

    print(f"[INFO] Output folder: {output_folder}")
    print(f"[INFO] Video dimensions: {video_width}x{video_height}")
    print(f"[INFO] Background: {background_file}")

    # Check required files exist
    if not output_folder.exists():
        print(f"[ERROR] Output folder not found: {output_folder}")
        print("[ERROR] Please run Steps 1 and 2 first.")
        sys.exit(1)

    if not audio_file.exists():
        print(f"[ERROR] Audio file not found: {audio_file}")
        print("[ERROR] Please run Step 1 first to create narration audio.")
        sys.exit(1)

    if not image_file.exists():
        print(f"[ERROR] Background image not found: {image_file}")
        print("[ERROR] Please ensure backgroundv.png exists in the 1-Vital folder.")
        sys.exit(1)

    print(f"[OK] Audio file: {audio_file}")
    print(f"[OK] Background image: {image_file}")

    # Get audio duration
    try:
        audio_duration = float(ffmpeg.probe(str(audio_file))['format']['duration'])
        print(f"[INFO] Audio duration: {audio_duration:.2f} seconds")
    except Exception as e:
        print(f"[ERROR] Could not read audio duration: {e}")
        sys.exit(1)

    # Generate video with selected format dimensions and background
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_file),
        "-i", str(audio_file),
        "-vf", f"scale={video_width}:{video_height}:force_original_aspect_ratio=decrease,pad={video_width}:{video_height}:(ow-iw)/2:(oh-ih)/2",
        "-c:v", VIDEO_CODEC,
        "-c:a", "aac",
        "-t", str(audio_duration),
        "-pix_fmt", PIX_FMT,
        "-r", str(FRAME_RATE),
        "-shortest", str(output_video)
    ]

    print(f"[VIDEO] Creating narration video: {output_video.name}")
    print(f"[INFO] This may take a few minutes...")

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"[OK] Video created successfully: {output_video}")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] FFmpeg failed: {e}")
        print(f"[ERROR] FFmpeg stderr: {e.stderr}")
        sys.exit(1)

    # Verify video was created
    if not output_video.exists():
        print(f"[ERROR] Video file was not created: {output_video}")
        sys.exit(1)

    # Get video file size
    video_size_mb = output_video.stat().st_size / (1024 * 1024)
    print(f"[OK] Video size: {video_size_mb:.2f} MB")

    print("\n" + "="*60)
    print("NARRATION VIDEO COMPLETE")
    print("="*60)
    print(f"Output: {output_video}")
    print(f"Duration: {audio_duration:.2f} seconds")
    print(f"Size: {video_size_mb:.2f} MB")
    print("="*60 + "\n")

    print("[OK] Step 3 completed successfully!")
    sys.exit(0)


if __name__ == "__main__":
    main()
