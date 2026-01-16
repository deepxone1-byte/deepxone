#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
STEP 1: Create Essay and Audio (Web Parameters Version)
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
except ImportError:
    print("[WARN] python-dotenv not installed. Install with: pip install python-dotenv")
except Exception as e:
    print(f"[WARN] Could not load .env file: {e}")

import os
import re
import json
import sys
import time
import docx
import requests
import whisper
from pathlib import Path
from datetime import datetime
from openai import OpenAI
import configparser
import subprocess

# --- Load config from file ---
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/00_STEP1_Nasean_Create_Essay_11_createMP3and_TimeStamp_short.txt")

ROOT_FOLDER = config.get("DEFAULT", "ROOT_FOLDER")
OUTPUT_FOLDER_NAME = config.get("DEFAULT", "OUTPUT_FOLDER")
AUDIO_FILE_NAME = config.get("DEFAULT", "AUDIO_FILE")
selected_voice = config.get("DEFAULT", "VOICE")
tts_model = config.get("DEFAULT", "TTS_MODEL")
timestamp_file_name = config.get("DEFAULT", "TIMESTAMP_FILE")
whisper_model = config.get("DEFAULT", "WHISPER_MODEL")
max_chars = config.getint("DEFAULT", "MAX_TTS_CHARS")
retries = config.getint("DEFAULT", "RETRY_ATTEMPTS")
min_segment_duration = config.getint("DEFAULT", "MIN_SEGMENT_DURATION_SECONDS", fallback=5)

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("[ERROR] OPENAI_API_KEY not set.")
    sys.exit(1)

client = OpenAI(api_key=api_key)
session = requests.Session()

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
    print(f"  Reading Length: {params['readingLength']}s")
    print(f"  Params file: {params_file}")
    print()

    return params


def create_output_folder(slug):
    """Create output folder structure using slug"""
    # Use slug as folder name (e.g., WED26-2026-01-15-23-37-49)
    base_folder = Path(ROOT_FOLDER) / slug
    output_folder = base_folder / OUTPUT_FOLDER_NAME

    output_folder.mkdir(parents=True, exist_ok=True)
    print(f"[OK] Output folder created: {output_folder}")

    return output_folder


def generate_essay_from_gpt(prompt, emotion_style=None, model="gpt-4"):
    """Generate essay using GPT-4 with optional emotion/style"""
    print("[AI] Generating essay with GPT-4...")

    # Build system message with emotion/style if provided
    system_message = "You are an expert educational content creator."
    if emotion_style and emotion_style != 'neutral':
        # Map emotion styles to writing instructions
        emotion_map = {
            'soft_angelic': 'gentle, soothing, and compassionate',
            'lecture': 'academic, authoritative, and professorial',
            'rhythmical': 'flowing with musical rhythm and cadence',
            'dramatic': 'expressive, dynamic, and theatrical',
            'conversational': 'casual, friendly, and approachable',
            'mysterious': 'suspenseful, enigmatic, and intriguing',
            'energetic': 'upbeat, excited, and motivational',
            'contemplative': 'reflective, philosophical, and meditative',
            'storyteller': 'narrative-driven with vivid imagery'
        }

        style_desc = emotion_map.get(emotion_style, emotion_style)
        system_message += f" Write in a {style_desc} tone and style."
        print(f"[INFO] Using emotion style: {style_desc}")

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )

        content = response.choices[0].message.content
        print(f"[OK] Essay generated ({len(content)} characters)")

        # Extract JSON from the response
        # GPT should return JSON wrapped in ```json ... ```
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', content, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            data = json.loads(json_str)
            return data
        else:
            # Try to parse the entire content as JSON
            try:
                data = json.loads(content)
                return data
            except:
                print("[WARN] Warning: Could not parse JSON from GPT response")
                return {
                    "article_text": content,
                    "slug": "unknown",
                    "title": "Unknown"
                }

    except Exception as e:
        print(f"[ERROR] Error generating essay: {e}")
        sys.exit(1)


def save_essay_to_docx(essay_text, output_folder):
    """Save essay text to Word document"""
    doc = docx.Document()
    for paragraph in essay_text.split('\n\n'):
        if paragraph.strip():
            doc.add_paragraph(paragraph.strip())

    essay_file = output_folder / "essay_short.docx"
    doc.save(essay_file)
    print(f"[OK] Essay saved to: {essay_file}")


def create_audio_narration(essay_text, output_folder, voice_override=None):
    """Create MP3 audio narration using OpenAI TTS"""
    print("[AUDIO] Creating audio narration...")

    # Use voice override from workflow params if provided, otherwise use config
    voice_to_use = voice_override if voice_override else selected_voice
    print(f"[INFO] Using voice: {voice_to_use}")

    audio_file = output_folder / AUDIO_FILE_NAME

    try:
        response = client.audio.speech.create(
            model=tts_model,
            voice=voice_to_use,
            input=essay_text
        )

        response.stream_to_file(audio_file)
        print(f"[OK] Audio saved to: {audio_file}")
        return audio_file

    except Exception as e:
        print(f"[ERROR] Error creating audio: {e}")
        sys.exit(1)


def create_timestamps_with_whisper(audio_file, output_folder):
    """Use Whisper to create timestamps"""
    print("[TIME] Creating timestamps with Whisper...")

    try:
        model = whisper.load_model(whisper_model)
        result = model.transcribe(str(audio_file), word_timestamps=True)

        timestamp_file = output_folder / timestamp_file_name
        with open(timestamp_file, 'w', encoding='utf-8') as f:
            segment_num = 1
            for segment in result['segments']:
                start_time = segment['start']
                end_time = segment['end']
                text = segment['text'].strip()

                f.write(f"Segment {segment_num}\n")
                f.write(f"Start: {start_time:.2f}s\n")
                f.write(f"End: {end_time:.2f}s\n")
                f.write(f"Text: {text}\n")
                f.write("\n")

                segment_num += 1

        print(f"[OK] Timestamps saved to: {timestamp_file}")
        print(f"[OK] Total segments: {len(result['segments'])}")

    except Exception as e:
        print(f"[ERROR] Error creating timestamps: {e}")
        sys.exit(1)


def save_youtube_metadata(data, output_folder):
    """Save YouTube title and description"""
    title = data.get('title', 'Unknown Title')
    slug = data.get('slug', 'unknown')

    # Save title
    title_file = output_folder / "youtubetitle.txt"
    with open(title_file, 'w', encoding='utf-8') as f:
        f.write(title)

    # Save description
    desc_file = output_folder / "youtubedescription.txt"
    with open(desc_file, 'w', encoding='utf-8') as f:
        f.write(f"Learn about {title}\n\n")
        f.write(f"Generated by Smartikle Content Pipeline\n")
        f.write(f"Slug: {slug}\n")

    print(f"[OK] YouTube metadata saved")


def save_quiz_data(quiz_json, output_folder):
    """Save quiz JSON for later use"""
    quiz_file = output_folder / "quiz_data.json"
    with open(quiz_file, 'w', encoding='utf-8') as f:
        json.dump(quiz_json, f, indent=2)
    print(f"[OK] Quiz data saved to: {quiz_file}")


def save_essay_json(slug, title, article_text, output_folder):
    """Save essay data as JSON for later use"""
    essay_data = {
        "slug": slug,
        "title": title,
        "body": article_text
    }
    essay_file = output_folder / "essay.json"
    with open(essay_file, 'w', encoding='utf-8') as f:
        json.dump(essay_data, f, ensure_ascii=False, indent=2)
    print(f"[OK] Essay JSON saved to: {essay_file}")


def extract_visual_metadata(topic, article_text):
    """Extract visual metadata from essay for consistent image generation"""
    print("[AI] Extracting visual metadata for image generation...")

    metadata_prompt = f"""Analyze this essay about "{topic}" and extract key visual information for AI image generation.

Essay:
{article_text[:2000]}

Extract and provide DETAILED information about:

1. GEOGRAPHIC LOCATION & REGION:
   - Specific city/country/continent
   - Regional landscape (mountains, deserts, coastal, urban, rural)
   - Climate and weather patterns typical to region
   - Notable landmarks or geographic features
   - Architecture style common to that region/era

2. TIME PERIOD & HISTORICAL CONTEXT:
   - Exact years or era
   - Historical period visual characteristics
   - Technology level of the time

3. PEOPLE & CULTURAL CONTEXT:
   - Who are the main people?
   - Physical descriptions (race/ethnicity, age range)
   - Traditional clothing styles of that region/time
   - Cultural elements specific to that location

4. VISUAL STYLE & AESTHETICS:
   - Art style (realistic, historical photograph style, illustrated, etc.)
   - Color palette (warm/cool tones, specific colors for region)
   - Lighting style (bright, muted, golden hour, etc.)

5. REGIONAL BACKGROUND ELEMENTS:
   - What backgrounds/settings fit this location?
   - Natural environment features
   - Architectural elements
   - Cultural symbols or objects

6. ATMOSPHERE & MOOD:
   - Emotional tone (hopeful, serious, celebratory, dramatic, etc.)
   - Energy level (calm, dynamic, intense)

Return as 2-4 concise sentences focusing heavily on LOCATION and REGIONAL characteristics for backgrounds.
Format as:
"Setting: [specific city/region, country]. Time: [era/years]. Background: [describe regional landscape, architecture, and environmental features]. Visual style: [art style, color palette, lighting]. People: [brief physical/cultural description]. Atmosphere: [mood]."
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at extracting visual details for AI image generation. Be specific and concise."},
                {"role": "user", "content": metadata_prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        metadata = response.choices[0].message.content.strip()
        print(f"[OK] Visual metadata extracted ({len(metadata)} characters)")
        return metadata

    except Exception as e:
        print(f"[WARN] Could not extract visual metadata: {e}")
        return f"Visual context: {topic}"


def save_visual_metadata(metadata, output_folder):
    """Save visual metadata to file for Step 2 to use"""
    metadata_file = output_folder / "essay_metadata.txt"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        f.write(metadata)
    print(f"[OK] Visual metadata saved to: {metadata_file}")


def main():
    print("""
================================================================
              STEP 1: Essay Creation & Audio Narration
                   (Web Parameters Version)
================================================================
    """)

    # Load workflow parameters
    params = load_workflow_params()

    # Create output folder using slug
    output_folder = create_output_folder(params['slug'])

    # Generate essay using GPT with emotion style
    emotion_style = params.get('emotionStyle', None)
    essay_data = generate_essay_from_gpt(params['prompt'], emotion_style)

    # Extract article text
    article_text = essay_data.get('article_text', '')
    if not article_text:
        print("[ERROR] No article text generated")
        sys.exit(1)

    # Save essay to DOCX
    save_essay_to_docx(article_text, output_folder)

    # Save essay to JSON
    essay_title = essay_data.get('title', params['topic'])
    save_essay_json(params['slug'], essay_title, article_text, output_folder)

    # Extract visual metadata for image generation
    visual_metadata = extract_visual_metadata(params['topic'], article_text)
    save_visual_metadata(visual_metadata, output_folder)

    # Create audio narration with selected voice
    voice_selection = params.get('ttsVoice', None)  # Get voice from params if available
    audio_file = create_audio_narration(article_text, output_folder, voice_selection)

    # Create timestamps with Whisper
    create_timestamps_with_whisper(audio_file, output_folder)

    # Save YouTube metadata
    save_youtube_metadata(essay_data, output_folder)

    # Save quiz data if present
    if 'quiz_json' in essay_data:
        save_quiz_data(essay_data['quiz_json'], output_folder)

    print("""
================================================================
                    STEP 1 COMPLETED SUCCESSFULLY
================================================================
    """)

    # Auto-launch STEP 2
    print("\n[START] Auto-launching STEP 2...")
    try:
        subprocess.run(
            ["python", "12_STEP2_Nasean_Generate_Image_from_prompts_short_V7.py", "--use-date-file"],
            check=True
        )
    except:
        print("[WARN] Could not auto-launch STEP 2")


if __name__ == "__main__":
    main()
