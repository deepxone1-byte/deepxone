import subprocess
import os
import ffmpeg
import sys
import configparser
from pathlib import Path
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials
from tkcalendar import Calendar
import tkinter as tk
import argparse

# === Load config ===
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/13_STEP3_Nasean_Create_Nasean_NarrationMP4_vertical.txt")

#root_folder = Path(config.get("DEFAULT", "ROOT_FOLDER", fallback="Course_Collective"))
ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"
FRAME_RATE = config.getint("DEFAULT", "FRAME_RATE")
VIDEO_CODEC = config.get("DEFAULT", "VIDEO_CODEC")
PIX_FMT = config.get("DEFAULT", "PIX_FMT")
SERVICE_ACCOUNT_FILE = os.getenv("SMARTIKLE_WORKBOOK_GOOGLE_CREDENTIALS")
#SHEET_ID = os.getenv("SMARTIKLE_GOOGLE_SHEET_ID")
SHEET_ID="1iuQ53zJSD5b9QtGkEw74RfHHbMLbau0Bliv5r4bsIxs"
WORKSHEET_NAME = "G6VIR-short"

# === Google Sheets Auth ===
scope = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets"
]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
client_gsheet = gspread.authorize(creds)
sheet = client_gsheet.open_by_key(SHEET_ID).worksheet(WORKSHEET_NAME)
rows = sheet.get_all_values()
headers = rows[0]
data_rows = rows[1:]

# === Calendar or selected_date.txt ===
parser = argparse.ArgumentParser()
parser.add_argument("--use-date-file", action="store_true", help="Use selected_date.txt instead of calendar")
args = parser.parse_args()

selected_date = None
if args.use_date_file:
    date_file = Path("selected_date.txt")
    if not date_file.exists():
        print("❌ selected_date.txt not found.")
        sys.exit()
    selected_date = date_file.read_text().strip()
else:
    def on_submit():
        global selected_date
        selected_date = cal.get_date()
        root.destroy()

    root = tk.Tk()
    root.title("Select a Date")
    cal = Calendar(root, selectmode='day', date_pattern="yyyy-mm-dd")
    cal.pack(pady=20)
    tk.Button(root, text="Start", command=on_submit).pack(pady=10)
    root.mainloop()

    if not selected_date:
        print("❌ No date selected.")
        sys.exit()

# === Match Google Sheet Row ===
current_date = datetime.strptime(selected_date, "%Y-%m-%d")

for idx, row in enumerate(data_rows, start=2):
    row_date = row[9].strip()
    if row_date < selected_date:
        continue

    status = row[3].strip().lower()
    label = row[2].strip()
    print(f"🔍 Row {idx} — Date: {row_date}, Status: '{status}', Label: '{label}'")

    if status == "stop creating":
        print(f"🛑 STOP CREATING found at row {idx}. Exiting.")
        sys.exit()

    if status != "created images":
        print(f"⏭️ Skipping row {idx} — Status is '{status}'")
        continue
    else:
        print(f"✅ Ready to process row {idx}: {label}")

    if not label:
        print(f"❌ No label in Column C at row {idx}")
        continue

    parsed_date = datetime.strptime(row_date, "%Y-%m-%d")
    folder_name = f"{label}-{parsed_date.strftime('%m-%d-%Y')}"

    output_folder = ROOT_FOLDER / folder_name / "output"

    audio_file = output_folder / "narration_short.mp3"
    image_file = ROOT_FOLDER / "backgroundv.png"

    output_video = output_folder / "narration_backgroundv.mp4"

    if not audio_file.exists():
        print(f"❌ Audio missing: {audio_file}")
        continue
    if not image_file.exists():
        print(f"❌ Background missing: {image_file}")
        continue

    try:
        audio_duration = float(ffmpeg.probe(str(audio_file))['format']['duration'])
    except Exception as e:
        print(f"❌ Could not read duration: {e}")
        continue

    # Generate vertical video with 1080x1920 scaling using background.png
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_file),
        "-i", str(audio_file),
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
        "-c:v", VIDEO_CODEC,
        "-c:a", "aac",
        "-t", str(audio_duration),
        "-pix_fmt", PIX_FMT,
        "-r", str(FRAME_RATE),
        "-shortest", str(output_video)
    ]

    sheet.update_cell(idx, 4, "creating narration video")
    print(f"🎬 Creating: {output_video.name}")
    subprocess.run(cmd, check=True)
    print(f"✅ Saved: {output_video}")

    sheet.update_cell(idx, 4, "narrationmp4 created")
    print(f"✅ Finished processing row {idx}: {label}")
    # ✅ Launch Step 13 Final Video Creator
    import subprocess
    print("🚀 Launching Step 13: Final Video Creation...")
    try:
        subprocess.run(["python", "14_STEP4_Nasean_YOUTUBE_FFMPEG_Create_Final_Video_UPLOADER_verticle_v8.py", "--use-date-file"], check=True)
    except Exception as e:
        print(f"❌ Failed to run Step 13 script: {e}")
