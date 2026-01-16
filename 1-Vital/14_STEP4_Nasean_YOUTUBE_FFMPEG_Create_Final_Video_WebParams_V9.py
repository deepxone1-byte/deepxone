#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
STEP 4: Create Final Video (Web Parameters Version)
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
import ffmpeg
import os
import re
import sys
import json
import configparser
from pathlib import Path
from datetime import datetime

# --- CONFIG ---
script_dir = Path(__file__).resolve().parent
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/14_STEP4_Nasean_YOUTUBE_FFMPEG_Create_Final_Video_UPLOADER_verticle_v6.txt")

root_folder = Path(__file__).resolve().parent / "Course_Collective"
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


def fix_image_and_txt_naming(image_folder):
    """Rename image files to consistent 5-digit format"""
    for file in image_folder.glob("*"):
        if file.suffix.lower() in [".png", ".txt"]:
            old_name = file.stem
            if old_name.isdigit() and len(old_name) == 3:
                new_name = f"{int(old_name):05}"
                new_file = file.with_name(f"{new_name}{file.suffix}")
                file.rename(new_file)
                print(f"[FIX] Renamed {file.name} -> {new_file.name}")


def overlay_on_background(img, bg, out):
    """Overlay image on background"""
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(bg),
        "-i", str(img),
        "-filter_complex", "[1:v]scale=1024:1024[fg];[0:v][fg]overlay=(W-w)/2:(H-h)/2",
        "-frames:v", "1", str(out)
    ], check=True, capture_output=True)


def main():
    print("\n" + "="*60)
    print("STEP 4: Create Final Video")
    print("="*60 + "\n")

    # Load workflow parameters
    params = load_workflow_params()

    # Use slug as folder name (e.g., WED26-2026-01-15-23-37-49)
    folder_name = params['slug']
    working_folder = script_dir / root_folder / folder_name
    output_folder = working_folder / "output"

    print(f"[INFO] Processing folder: {folder_name}")
    print(f"[INFO] Output folder: {output_folder}")

    # Get video format from params (default to landscape)
    video_format = params.get('videoFormat', 'landscape')
    print(f"[INFO] Video format: {video_format}")

    # Determine video dimensions and background based on format
    format_config = {
        'landscape': {
            'width': 1920,
            'height': 1080,
            'background': 'background.jpg'
        },
        'portrait': {
            'width': 1080,
            'height': 1920,
            'background': 'backgroundv.jpg'
        },
        'square': {
            'width': 1080,
            'height': 1080,
            'background': 'background.jpg'  # Use landscape, will be cropped to square
        }
    }

    config_data = format_config.get(video_format, format_config['landscape'])
    video_width = config_data['width']
    video_height = config_data['height']
    background_filename = config_data['background']

    print(f"[INFO] Video dimensions: {video_width}x{video_height}")
    print(f"[INFO] Background: {background_filename}")

    # Check if output folder exists
    if not output_folder.exists():
        print(f"[ERROR] Output folder not found: {output_folder}")
        print("[ERROR] Please run Steps 1-3 first.")
        sys.exit(1)

    try:
        # Find or copy background image based on format
        background_image = output_folder / background_filename
        if not background_image.exists():
            default_bg = script_dir / root_folder / background_filename
            if default_bg.exists():
                background_image.write_bytes(default_bg.read_bytes())
                print("[OK] Copied background image to output folder")
            else:
                print(f"[ERROR] Background image not found: {background_filename}")
                print(f"[ERROR] Please ensure {background_filename} exists in Course_Collective folder.")
                sys.exit(1)

        # Setup paths
        image_folder = output_folder / "images"
        timestamp_file = output_folder / "narration_timestamps_short.txt"
        audio_file = output_folder / "narration_backgroundv.mp4"
        response_file = output_folder / "youtubetitle.txt"
        temp_folder = output_folder / "segmentsv"
        overlaid_folder = output_folder / "overlaidv"
        concat_file = output_folder / "concat_list.txt"
        output_video = output_folder / "final_videov.mp4"
        video_only = output_folder / "video_no_audiov.mp4"
        log_file = output_folder / "image2vid.txt"

        # Create temp folders
        temp_folder.mkdir(exist_ok=True)
        overlaid_folder.mkdir(exist_ok=True)

        # Verify required files
        if not image_folder.exists():
            print(f"[ERROR] Image folder not found: {image_folder}")
            print("[ERROR] Please run Step 2 first to generate images.")
            sys.exit(1)

        if not timestamp_file.exists():
            print(f"[ERROR] Timestamp file not found: {timestamp_file}")
            print("[ERROR] Please run Step 1 first.")
            sys.exit(1)

        if not audio_file.exists():
            print(f"[ERROR] Narration video not found: {audio_file}")
            print("[ERROR] Please run Step 3 first.")
            sys.exit(1)

        if not response_file.exists():
            print(f"[WARN] Youtube title file not found: {response_file}")
            # Create a default one
            with open(response_file, 'w', encoding='utf-8') as f:
                f.write(f"{params['topic']}\n")
                f.write("Auto-generated educational video.\n")
            print("[OK] Created default youtube title file")

        print("[OK] All required files found")

        # Fix image naming
        fix_image_and_txt_naming(image_folder)

        # Parse timestamps and create overlaid images
        print("[VIDEO] Parsing timestamps and overlaying images...")
        segments = []

        # Parse timestamps (handles both old bracket and new multi-line formats)
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
                        # Extract segment number, start, and end
                        segment_num = int(lines[0].strip())
                        start_line = [l for l in lines if l.startswith("Start:")][0]
                        end_line = [l for l in lines if l.startswith("End:")][0]

                        start = float(start_line.split(":")[1].strip().replace("s", ""))
                        end = float(end_line.split(":")[1].strip().replace("s", ""))
                        duration = round(end - start, 3)

                        img = image_folder / f"{segment_num:05}.png"
                        out = overlaid_folder / f"{segment_num:05}_overlay.png"
                        if img.exists():
                            print(f"[VIDEO] Processing image {segment_num}...")
                            overlay_on_background(img, background_image, out)
                            segments.append((out, start, end, duration))
                    except Exception as e:
                        print(f"[WARN] Failed to parse segment: {e}")
                        continue
        else:
            # Parse old bracket format: [0.00s - 5.54s] Text
            pattern = r"\[(\d+\.\d+)s\s*-\s*(\d+\.\d+)s\]"
            for idx_img, line in enumerate(content.split("\n")):
                match = re.match(pattern, line.strip())
                if match:
                    start = float(match.group(1))
                    end = float(match.group(2))
                    duration = round(end - start, 3)
                    img = image_folder / f"{idx_img+1:05}.png"
                    out = overlaid_folder / f"{idx_img+1:05}_overlay.png"
                    if img.exists():
                        print(f"[VIDEO] Processing image {idx_img+1}...")
                        overlay_on_background(img, background_image, out)
                        segments.append((out, start, end, duration))

        print(f"[OK] Created {len(segments)} overlaid images")

        # Create video segments
        print("[VIDEO] Creating video segments...")
        concat_lines = []
        log_lines = []
        last_end = 0
        last_overlay = None

        for idx_img, (img, start, end, dur) in enumerate(segments):
            # Create gap segment if needed
            if start > last_end and last_overlay:
                gap = start - last_end
                gap_segment = temp_folder / f"gap_{idx_img:03}.mp4"
                print(f"[VIDEO] Creating gap segment ({gap:.2f}s)...")
                subprocess.run([
                    "ffmpeg", "-y", "-loop", "1",
                    "-i", str(last_overlay),
                    "-t", str(gap), "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-r", str(FRAME_RATE),
                    "-an", str(gap_segment)
                ], check=True, capture_output=True)
                concat_lines.append(f"file '{gap_segment.as_posix()}'")

            # Create main segment
            segment = temp_folder / f"seg_{idx_img:03}.mp4"
            print(f"[VIDEO] Creating segment {idx_img+1}/{len(segments)} ({dur:.2f}s)...")
            subprocess.run([
                "ffmpeg", "-y", "-loop", "1",
                "-i", str(img),
                "-t", str(dur), "-c:v", "libx264",
                "-pix_fmt", "yuv420p", "-r", str(FRAME_RATE),
                "-an", str(segment)
            ], check=True, capture_output=True)
            concat_lines.append(f"file '{segment.as_posix()}'")
            log_lines.append(f"{img.name} duration {dur:.2f}s")
            last_end = end
            last_overlay = img

        # Save concat list and log
        with open(concat_file, "w", encoding="utf-8") as f:
            f.write("\n".join(concat_lines))
        with open(log_file, "w", encoding="utf-8") as f:
            f.write("\n".join(log_lines))

        print(f"[OK] Created {len(concat_lines)} video segments")

        # Concatenate all segments
        print("[VIDEO] Concatenating video segments...")
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_file), "-c", "copy", str(video_only)
        ], check=True, capture_output=True)
        print("[OK] Video concatenated")

        # Merge with audio
        print("[VIDEO] Merging video with audio...")
        audio_duration = float(ffmpeg.probe(str(audio_file))['format']['duration'])
        subprocess.run([
            "ffmpeg", "-y",
            "-i", str(video_only),
            "-i", str(audio_file),
            "-filter_complex",
            f"[0:v]scale={video_width}:{video_height}:force_original_aspect_ratio=decrease,pad={video_width}:{video_height}:(ow-iw)/2:(oh-ih)/2,tpad=stop_mode=clone:stop_duration={audio_duration+2}[v]",
            "-map", "[v]", "-map", "1:a",
            "-c:v", VIDEO_CODEC, "-c:a", "aac",
            "-shortest", str(output_video)
        ], check=True, capture_output=True)

        # Verify video was created
        if not output_video.exists():
            print(f"[ERROR] Final video was not created: {output_video}")
            sys.exit(1)

        # Get video file size
        video_size_mb = output_video.stat().st_size / (1024 * 1024)

        print("\n" + "="*60)
        print("FINAL VIDEO COMPLETE")
        print("="*60)
        print(f"Output: {output_video}")
        print(f"Duration: {audio_duration:.2f} seconds")
        print(f"Size: {video_size_mb:.2f} MB")
        print(f"Segments: {len(segments)}")
        print("="*60 + "\n")

        print("[OK] Step 4 completed successfully!")
        print(f"[INFO] Final video saved to: {output_video}")

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] FFmpeg command failed: {e}")
        if e.stderr:
            print(f"[ERROR] FFmpeg stderr: {e.stderr.decode('utf-8')}")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Error processing video: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
