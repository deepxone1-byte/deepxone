# --- Start processing loop ---
import os
import re
import requests
import time
import sys
import configparser
from pathlib import Path
from datetime import datetime, timedelta
import gspread
from openai import OpenAI
from google.oauth2.service_account import Credentials
from tkcalendar import Calendar
import tkinter as tk
import argparse

# --- Load Config File ---
config = configparser.ConfigParser()
with open("DONT_DELETE_ENV_FILES/config/12_STEP2_Nasean_Generate_Image_from_prompts_short_V7.txt", "r", encoding="utf-8") as f:
    config.read_file(f)

#root_folder = config.get("DEFAULT", "ROOT_FOLDER", fallback="Course_Collective")
ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"

# --- Environment Setup ---
SERVICE_ACCOUNT_FILE = os.getenv("SMARTIKLE_WORKBOOK_GOOGLE_CREDENTIALS")
SHEET_ID="1iuQ53zJSD5b9QtGkEw74RfHHbMLbau0Bliv5r4bsIxs"
WORKSHEET_NAME = "G6VIR-short"

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

# --- Google Sheets Auth ---
scope = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
client_gsheet = gspread.authorize(creds)
sheet = client_gsheet.open_by_key(SHEET_ID).worksheet(WORKSHEET_NAME)
rows = sheet.get_all_values()
headers = rows[0]
data_rows = rows[1:]

# --- Handle calendar or date file ---
parser = argparse.ArgumentParser()
parser.add_argument("--use-date-file", action="store_true", help="Use selected_date.txt instead of calendar")
args = parser.parse_args()

selected_date = None
if args.use_date_file:
    date_file = Path("selected_date.txt")
    if not date_file.exists():
        print("❌ selected_date.txt not found. Please run Step 1 or select a date.")
        exit()
    selected_date = date_file.read_text().strip()
    print(f"📅 Using date from file: {selected_date}")
else:
    def on_submit():
        global selected_date
        selected_date = cal.get_date()
        root.destroy()

    root = tk.Tk()
    root.title("Select a Start Date")
    today = datetime.today()
    cal = Calendar(root, selectmode='day', year=today.year, month=today.month, day=today.day, date_pattern="yyyy-mm-dd")
    cal.pack(pady=20)
    tk.Button(root, text="Start", command=on_submit).pack(pady=10)
    root.mainloop()

    if not selected_date:
        print("❌ No date selected.")
        exit()

# --- OpenAI Setup ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("❌ ERROR: OPENAI_API_KEY not set.")
    exit()
client = OpenAI(api_key=api_key)

def generate_prompt(narration):
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
        print(f"⚠️ Warning: Prompt too long ({len(full_prompt)} characters). Trimming.")
        full_prompt = full_prompt[:3000] + "..."
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": full_prompt}
        ]
    )
    return response.choices[0].message.content.strip().replace("Prompt:", "").strip()

# --- Begin row processing loop ---
current_date = datetime.strptime(selected_date, "%Y-%m-%d")

for idx, row in enumerate(data_rows, start=2):
    row_date = row[9].strip() if len(row) > 9 else ""
    if row_date < selected_date:
        continue
    status = row[3].strip().lower().replace('\u200b', '')
    if status == "stop creating":
        print(f"🛑 STOP CREATING flag found in Column D for row {idx} — launching narration MP4 script.")
        try:
            import subprocess
            subprocess.run(["python", "13_STEP3_Nasean_Create_NarrationMP4_short_V8.py", "--use-date-file"], check=True)
        except Exception as e:
            print(f"❌ Failed to launch narration script: {e}")
        sys.exit(0)

        
    
    if status != "ready for images":
        print(f"⏭️ Skipping row {idx} — Status is '{status}'")
        continue

    label = row[2].strip()
    sheet.update_cell(idx, 4, "Processing Images")

    formatted_date = datetime.strptime(row_date, "%Y-%m-%d").strftime("%m-%d-%Y")
    folder_name = f"{label}-{formatted_date}"
    base_folder = ROOT_FOLDER / folder_name

    output_folder = base_folder / "output"
    image_folder = output_folder / "images"
    timestamp_file = output_folder / "narration_timestamps_short.txt"
    prompt_output_file = output_folder / "generated_prompts_short.txt"

    # 📥 Load essay metadata to append to each prompt
    metadata_file = output_folder / "essay_metadata.txt"
    essay_metadata = ""
    if metadata_file.exists():
        essay_metadata = "\n\nEssay Metadata:\n" + metadata_file.read_text(encoding="utf-8").strip()
    else:
        print(f"⚠️ essay_metadata.txt not found in {output_folder} — continuing without metadata.")





    if not output_folder.exists() or not timestamp_file.exists():
        print(f"❌ Required files missing for {folder_name}")
        sheet.update_cell(idx, 4, "Error")
        break

    image_folder.mkdir(parents=True, exist_ok=True)

    segments = []
    pattern = r"\[(\d+\.\d+)s\s*-\s*(\d+\.\d+)s\]\s*(.+)"
    with open(timestamp_file, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            match = re.match(pattern, line.strip())
            if match:
                text = match.group(3).strip()
                segments.append((f"{i+1:05}.png", text))


    generated_prompts = []
    total_segments = len(segments)
    skipped = created = failed = 0

    for idx_img, (filename, narration) in enumerate(segments, start=1):
        image_path = image_folder / filename
        if image_path.exists():
            print(f"⏭️ Skipping {filename} — image already exists.")
            skipped += 1
            continue

        print(f"🖌️ Generating image {filename}")
        prompt = generate_prompt(narration)
        if essay_metadata:
            prompt += f"\n{essay_metadata}"

        if not prompt or len(prompt.strip()) < 10:
            print(f"⚠️ Skipping {filename} — invalid prompt.")
            skipped += 1
            continue

        generated_prompts.append(f"{filename} → {prompt}")

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
                with open(image_path, "wb") as f:
                    f.write(img_data)
                with open(image_folder / Path(filename).with_suffix(".txt"), "w", encoding="utf-8") as pf:
                    pf.write(prompt)
                if image_path.exists():
                    print(f"✅ Saved {filename}")
                    created += 1
                else:
                    print(f"❌ {filename} not saved.")
                    failed += 1
                break
            except Exception as e:
                print(f"❌ Attempt {attempt+1} failed for {filename}: {e}")
                if attempt == retries - 1:
                    failed += 1

    with open(prompt_output_file, "w", encoding="utf-8") as pf:
        pf.write("\n".join(generated_prompts))

    summary_path = output_folder / "image_generation_summary.txt"
    with open(summary_path, "w", encoding="utf-8") as sf:

        sf.write(f"Total: {total_segments}\n")
        sf.write(f"Created: {created}\n")
        sf.write(f"Skipped: {skipped}\n")
        sf.write(f"Failed: {failed}\n")

    print(f"📄 Summary saved to: {summary_path}")
    sheet.update_cell(idx, 4, "created images")
    print(f"✅ Done with row {idx}")
    continue
