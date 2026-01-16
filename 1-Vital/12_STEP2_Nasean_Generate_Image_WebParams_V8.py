#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
STEP 2: Generate Images from Prompts (Web Parameters Version)
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
    print("[WARN] python-dotenv not installed. Install with: pip install python-dotenv")
except Exception as e:
    print(f"[WARN] Could not load .env file: {e}")

import os
import re
import requests
import time
import sys
import json
import configparser
from pathlib import Path
from datetime import datetime
from openai import OpenAI

# --- Load Config File ---
config = configparser.ConfigParser()
with open("DONT_DELETE_ENV_FILES/config/12_STEP2_Nasean_Generate_Image_from_prompts_short_V7.txt", "r", encoding="utf-8") as f:
    config.read_file(f)

ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"

INPUT_FILE_NAME = config.get("DEFAULT", "INPUT_FILE")
OUTPUT_FOLDER_NAME = config.get("DEFAULT", "OUTPUT_FOLDER")
AUDIO_FILE_NAME = config.get("DEFAULT", "AUDIO_FILE")
selected_voice = config.get("DEFAULT", "VOICE")
tts_model = config.get("DEFAULT", "TTS_MODEL")
timestamp_file_name = config.get("DEFAULT", "TIMESTAMP_FILE")
whisper_model = config.get("DEFAULT", "WHISPER_MODEL")
max_chars = config.getint("DEFAULT", "MAX_TTS_CHARS")
retries = config.getint("DEFAULT", "RETRY_ATTEMPTS")

REMOVE_HEADING = config.get("DEFAULT", "REMOVE_HEADING", fallback="YES").strip().upper() == "YES"
REMOVE_SUB_HEADING = config.get("DEFAULT", "REMOVE_SUB_HEADING", fallback="YES").strip().upper() == "YES"

size = config.get("DEFAULT", "size")
style = config.get("DEFAULT", "style")
mode = config.get("DEFAULT", "mode")
guidance = config.get("DEFAULT", "guidance")
negative_guidance = config.get("DEFAULT", "negative_guidance")
append = config.get("DEFAULT", "append", fallback="")
style_tags = config.get("DEFAULT", "style_tags", fallback="").split(",")
system_msg = config.get("DEFAULT", "system_msg")
always_append = f"{append}, {', '.join(style_tags)}"

# --- OpenAI Setup ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("[ERROR] OPENAI_API_KEY not set.")
    sys.exit(1)
client = OpenAI(api_key=api_key)


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


def generate_prompt(narration):
    """Generate image prompt from narration text"""
    user_msg = (
        f"Create a prompt for a {style} {mode} illustration from the following narration:\n"
        f"\"{narration}\"\n"
        f"Follow this style instruction: {guidance}\n"
        f"Avoid: {negative_guidance}\n"
        f"End with: {always_append}\n"
        f"Respond in one sentence starting with 'Prompt:'"
    )
    full_prompt = user_msg
    if len(full_prompt) > 3000:
        print(f"[WARN] Warning: Prompt too long ({len(full_prompt)} characters). Trimming.")
        full_prompt = full_prompt[:3000] + "..."

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": full_prompt}
        ]
    )
    return response.choices[0].message.content.strip().replace("Prompt:", "").strip()


def main():
    print("\n" + "="*60)
    print("STEP 2: Generate Images from Prompts")
    print("="*60 + "\n")

    # Load workflow parameters
    params = load_workflow_params()

    # Use slug as folder name (e.g., WED26-2026-01-15-23-37-49)
    folder_name = params['slug']
    base_folder = ROOT_FOLDER / folder_name

    output_folder = base_folder / OUTPUT_FOLDER_NAME
    image_folder = output_folder / "images"
    timestamp_file = output_folder / "narration_timestamps_short.txt"
    prompt_output_file = output_folder / "generated_prompts_short.txt"

    print(f"[INFO] Processing folder: {folder_name}")
    print(f"[INFO] Output folder: {output_folder}")

    # Load essay metadata to append to each prompt
    metadata_file = output_folder / "essay_metadata.txt"
    essay_metadata = ""
    if metadata_file.exists():
        essay_metadata = "\n\nEssay Metadata:\n" + metadata_file.read_text(encoding="utf-8").strip()
        print("[OK] Essay metadata loaded")
    else:
        print("[WARN] essay_metadata.txt not found — continuing without metadata.")

    # Check if required files exist
    if not output_folder.exists():
        print(f"[ERROR] Output folder not found: {output_folder}")
        print("[ERROR] Please run Step 1 first to create the essay and audio.")
        sys.exit(1)

    if not timestamp_file.exists():
        print(f"[ERROR] Timestamp file not found: {timestamp_file}")
        print("[ERROR] Please run Step 1 first to create narration timestamps.")
        sys.exit(1)

    # Create image folder
    image_folder.mkdir(parents=True, exist_ok=True)
    print(f"[OK] Image folder ready: {image_folder}")

    # Parse timestamps (handles both formats)
    segments = []

    # Try old format first: [0.00s - 5.54s] Text here
    old_pattern = r"\[(\d+\.\d+)s\s*-\s*(\d+\.\d+)s\]\s*(.+)"

    # New format: Multi-line segments
    with open(timestamp_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if it's the new multi-line format
    if "Start:" in content and "End:" in content:
        # Parse multi-line format
        segment_blocks = content.split("Segment ")
        for block in segment_blocks[1:]:  # Skip first empty block
            lines = block.strip().split("\n")
            if len(lines) >= 4:
                try:
                    # Extract start, end, and text
                    start_line = [l for l in lines if l.startswith("Start:")][0]
                    end_line = [l for l in lines if l.startswith("End:")][0]
                    text_line = [l for l in lines if l.startswith("Text:")][0]

                    start = float(start_line.split(":")[1].strip().replace("s", ""))
                    end = float(end_line.split(":")[1].strip().replace("s", ""))
                    text = text_line.split(":", 1)[1].strip()

                    segment_num = int(lines[0].strip())
                    segments.append((f"{segment_num:05}.png", text))
                except:
                    continue
    else:
        # Parse old bracket format
        for i, line in enumerate(content.split("\n")):
            match = re.match(old_pattern, line.strip())
            if match:
                text = match.group(3).strip()
                segments.append((f"{i+1:05}.png", text))

    print(f"[INFO] Found {len(segments)} narration segments")

    # Generate images
    generated_prompts = []
    total_segments = len(segments)
    skipped = created = failed = 0

    for idx_img, (filename, narration) in enumerate(segments, start=1):
        image_path = image_folder / filename

        # Skip if image already exists
        if image_path.exists():
            print(f"[SKIP] {filename} — image already exists.")
            skipped += 1
            continue

        print(f"[AI] Generating image {idx_img}/{total_segments}: {filename}")

        # Generate prompt
        prompt = generate_prompt(narration)
        if essay_metadata:
            prompt += f"\n{essay_metadata}"

        if not prompt or len(prompt.strip()) < 10:
            print(f"[WARN] Skipping {filename} — invalid prompt.")
            skipped += 1
            continue

        generated_prompts.append(f"{filename} -> {prompt}")

        # Generate image with retries
        for attempt in range(retries):
            try:
                response = client.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size=size,
                    quality="standard",
                    n=1
                )
                img_url = response.data[0].url
                img_data = requests.get(img_url).content

                # Save image
                with open(image_path, "wb") as f:
                    f.write(img_data)

                # Save prompt text
                with open(image_folder / Path(filename).with_suffix(".txt"), "w", encoding="utf-8") as pf:
                    pf.write(prompt)

                if image_path.exists():
                    print(f"[OK] Saved {filename}")
                    created += 1
                else:
                    print(f"[ERROR] {filename} not saved.")
                    failed += 1
                break

            except Exception as e:
                print(f"[ERROR] Attempt {attempt+1} failed for {filename}: {e}")
                if attempt == retries - 1:
                    failed += 1
                else:
                    time.sleep(2)  # Wait before retry

    # Save generated prompts
    with open(prompt_output_file, "w", encoding="utf-8") as pf:
        pf.write("\n".join(generated_prompts))
    print(f"[OK] Prompts saved to: {prompt_output_file}")

    # Save summary
    summary_path = output_folder / "image_generation_summary.txt"
    with open(summary_path, "w", encoding="utf-8") as sf:
        sf.write(f"Total Segments: {total_segments}\n")
        sf.write(f"Images Created: {created}\n")
        sf.write(f"Already Existed (Skipped): {skipped}\n")
        sf.write(f"Failed: {failed}\n")
        sf.write(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    print(f"[OK] Summary saved to: {summary_path}")

    # Create thumbnail for smartikle article
    print("\n" + "="*60)
    print("CREATING ARTICLE THUMBNAIL")
    print("="*60)

    import shutil

    # Get the first image as thumbnail
    first_image = image_folder / "001.png"
    if first_image.exists():
        # Path to smartikle public images folder
        smartikle_images_folder = Path(__file__).resolve().parent.parent / "smartikle" / "public" / "images"
        smartikle_images_folder.mkdir(parents=True, exist_ok=True)

        # Save as slug.png to public/images
        thumbnail_path = smartikle_images_folder / f"{params['slug']}.png"

        try:
            shutil.copy2(first_image, thumbnail_path)
            print(f"[OK] Thumbnail created: {thumbnail_path}")
            print(f"    Source: {first_image}")
        except Exception as e:
            print(f"[ERROR] Failed to create thumbnail: {e}")

        # Also copy to output folder (same folder as essay.json and quiz_data.json)
        output_thumbnail_path = output_folder / f"{params['slug']}.png"
        try:
            shutil.copy2(first_image, output_thumbnail_path)
            print(f"[OK] Thumbnail copied to output folder: {output_thumbnail_path}")
        except Exception as e:
            print(f"[ERROR] Failed to copy thumbnail to output folder: {e}")
    else:
        print(f"[WARN] No images found to create thumbnail (expected: {first_image})")

    print("="*60 + "\n")

    # Print final summary
    print("\n" + "="*60)
    print("IMAGE GENERATION COMPLETE")
    print("="*60)
    print(f"Total Segments: {total_segments}")
    print(f"Images Created: {created}")
    print(f"Already Existed: {skipped}")
    print(f"Failed: {failed}")
    print("="*60 + "\n")

    if failed > 0:
        print("[WARN] Some images failed to generate. Check the logs above.")
        sys.exit(1)
    else:
        print("[OK] All images generated successfully!")
        sys.exit(0)


if __name__ == "__main__":
    main()
