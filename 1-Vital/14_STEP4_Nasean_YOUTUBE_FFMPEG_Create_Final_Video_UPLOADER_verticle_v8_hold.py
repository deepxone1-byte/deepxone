import subprocess
import ffmpeg
import os
import re
import sys
import configparser
from pathlib import Path
from datetime import datetime, timedelta
import gspread
from google.oauth2.service_account import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import pickle
import argparse

# --- CONFIG ---
script_dir = Path(__file__).resolve().parent
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/14_STEP4_Nasean_YOUTUBE_FFMPEG_Create_Final_Video_UPLOADER_verticle_v6.txt")

#root_folder = Path(config.get("DEFAULT", "ROOT_FOLDER", fallback="Course_Collective"))
ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"
SERVICE_ACCOUNT_FILE = os.getenv("SMARTIKLE_WORKBOOK_GOOGLE_CREDENTIALS")
SHEET_ID="1iuQ53zJSD5b9QtGkEw74RfHHbMLbau0Bliv5r4bsIxs"
WORKSHEET_NAME="G6VIR-short"
FRAME_RATE = config.getint("DEFAULT", "FRAME_RATE")
VIDEO_CODEC = config.get("DEFAULT", "VIDEO_CODEC")
PIX_FMT = config.get("DEFAULT", "PIX_FMT")
CLIENT_SECRETS_FILE = "C:/SmartiklePosts/DONT_DELETE_ENV_FILES/oauth/client_secret_26296525197-aduikkqoe7r0ecpg8oo7j31bctjhqen0.apps.googleusercontent.com.json"


# --- Google Sheet Access ---
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

def fix_image_and_txt_naming(image_folder):
    for file in image_folder.glob("*"):
        if file.suffix.lower() in [".png", ".txt"]:
            old_name = file.stem

            # ✅ Skip if already 5-digit padded (like 00001, 00002)
            if old_name.isdigit() and len(old_name) == 5:
                print(f"✅ Already correctly named: {file.name}")
                continue

            # ✅ Rename only 3-digit or irregular numeric files
            if old_name.isdigit():
                new_name = f"{int(old_name):05}"
                new_file = file.with_name(f"{new_name}{file.suffix}")
                
                if new_file.exists():
                    print(f"⚠️ Skipping rename: {new_file.name} already exists.")
                    continue

                file.rename(new_file)
                print(f"🔧 Renamed {file.name} -> {new_file.name}")


# --- Date selection ---
parser = argparse.ArgumentParser()
parser.add_argument("--use-date-file", action="store_true", help="Use selected_date.txt instead of calendar")
args = parser.parse_args()

selected_date = None
if args.use_date_file:
    date_file = Path("selected_date.txt")
    if not date_file.exists():
        print("❌ selected_date.txt not found.")
        exit()
    selected_date = date_file.read_text().strip()
    print(f"📅 Using date from file: {selected_date}")
else:
    from tkcalendar import Calendar
    import tkinter as tk
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

# --- YouTube Auth ---
def get_authenticated_youtube():
    scopes = ["https://www.googleapis.com/auth/youtube.upload"]
    token_path = script_dir / "youtube_token.pickle"
    creds = None
    if token_path.exists():
        with open(token_path, "rb") as token:
            creds = pickle.load(token)
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, scopes)
        creds = flow.run_local_server(port=0)
        with open(token_path, "wb") as token:
            pickle.dump(creds, token)
    return build("youtube", "v3", credentials=creds)

# ✅ FIXED upload_to_youtube with fallback title
def upload_to_youtube(video_path, response_txt):
    with open(response_txt, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    if not lines:
        print("❌ response.txt is empty or contains only blank lines.")
        return None

    title = lines[0]
    if not title or len(title.strip()) < 3:
        title = video_path.stem.replace("_", " ").title()
        print(f"⚠️ Using fallback title: {title}")

    description = "\n".join(lines[1:]).strip() if len(lines) > 1 else "Auto-generated video description."

    youtube = get_authenticated_youtube()
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "categoryId": "22"
        },
        "status": {
            "privacyStatus": "unlisted"
        }
    }

    media = MediaFileUpload(str(video_path), mimetype="video/*", resumable=True)
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"📤 Upload progress: {int(status.progress() * 100)}%")
    print(f"✅ YouTube Upload Complete: https://youtu.be/{response['id']}")
    return response["id"]

# --- Main Processing ---
# --- Main Processing ---
selected_dt = datetime.strptime(selected_date, "%Y-%m-%d")
row_found = False

for idx, row in enumerate(data_rows, start=2):
    if len(row) <= 9:
        continue

    row_date_str = row[9].strip()  # Column J
    if not row_date_str:
        continue

    try:
        row_dt = datetime.strptime(row_date_str, "%Y-%m-%d")
    except ValueError:
        continue

    if row_dt < selected_dt:
        continue

    status = row[3].strip().lower()  # Column D
    label = row[2].strip()           # Column C
    print(f"🔍 Row {idx} — Date: {row_date_str}, Status: '{status}', Label: '{label}'")

    if status == "stop creating":
        print(f"🛑 STOP CREATING flag found at row {idx}. Exiting.")
        break

    if status != "narrationmp4 created":
        print(f"⏭️ Skipping row {idx} — Status is '{status}'")
        continue

    print(f"✅ Ready to process row {idx}: {label}")
    folder_name = f"{label}-{row_dt.strftime('%m-%d-%Y')}"
    working_folder = script_dir / root_folder / folder_name
    output_folder = working_folder / "output"
    row_found = True

    try:
        background_image = None
        for name in ["backgroundv.png", "Backgroundv.png"]:
            candidate = output_folder / name
            if candidate.exists():
                background_image = candidate
                break

        if background_image is None:
            default_bg = script_dir / root_folder / "backgroundv.png"
            if default_bg.exists():
                background_image = output_folder / "backgroundv.png"
                background_image.write_bytes(default_bg.read_bytes())
            else:
                print("❌ No background image found. Skipping.")
                continue

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

        temp_folder.mkdir(exist_ok=True)
        overlaid_folder.mkdir(exist_ok=True)

        assert image_folder.exists(), "❌ image folder missing"
        assert timestamp_file.exists(), "❌ timestamp file missing"
        assert audio_file.exists(), "❌ narration.mp3 missing"
        assert response_file.exists(), "❌ response.txt missing"

        fix_image_and_txt_naming(image_folder)

        def overlay_on_background(img, bg, out):
            subprocess.run([
                "ffmpeg", "-y",
                "-i", str(bg),
                "-i", str(img),
                "-filter_complex", "[1:v]scale=1024:1024[fg];[0:v][fg]overlay=(W-w)/2:(H-h)/2",
                "-frames:v", "1", str(out)
            ], check=True)

        segments = []
        pattern = r"\[(\d+\.\d+)s\s*-\s*(\d+\.\d+)s\]"
        with open(timestamp_file, "r", encoding="utf-8") as f:
            for idx_img, line in enumerate(f):
                match = re.match(pattern, line.strip())
                if match:
                    start = float(match.group(1))
                    end = float(match.group(2))
                    duration = round(end - start, 3)
                    img = image_folder / f"{idx_img+1:05}.png"
                    out = overlaid_folder / f"{idx_img+1:05}_overlay.png"
                    if img.exists():
                        overlay_on_background(img, background_image, out)
                        segments.append((out, start, end, duration))

        concat_lines = []
        log_lines = []
        last_end = 0
        last_overlay = None

        for idx_img, (img, start, end, dur) in enumerate(segments):
            if start > last_end and last_overlay:
                gap = start - last_end
                gap_segment = temp_folder / f"gap_{idx_img:03}.mp4"
                subprocess.run([
                    "ffmpeg", "-y", "-loop", "1",
                    "-i", str(last_overlay),
                    "-t", str(gap), "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-r", str(FRAME_RATE),
                    "-an", str(gap_segment)
                ])
                concat_lines.append(f"file '{gap_segment.as_posix()}'")

            segment = temp_folder / f"seg_{idx_img:03}.mp4"
            subprocess.run([
                "ffmpeg", "-y", "-loop", "1",
                "-i", str(img),
                "-t", str(dur), "-c:v", "libx264",
                "-pix_fmt", "yuv420p", "-r", str(FRAME_RATE),
                "-an", str(segment)
            ])
            concat_lines.append(f"file '{segment.as_posix()}'")
            log_lines.append(f"{img.name} duration {dur:.2f}s")
            last_end = end
            last_overlay = img

        with open(concat_file, "w", encoding="utf-8") as f:
            f.write("\n".join(concat_lines))
        with open(log_file, "w", encoding="utf-8") as f:
            f.write("\n".join(log_lines))

        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_file), "-c", "copy", str(video_only)
        ])

        audio_duration = float(ffmpeg.probe(str(audio_file))['format']['duration'])
        subprocess.run([
            "ffmpeg", "-y",
            "-i", str(video_only),
            "-i", str(audio_file),
            "-filter_complex",
            f"[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,tpad=stop_mode=clone:stop_duration={audio_duration+2}[v]",
            "-map", "[v]", "-map", "1:a",
            "-c:v", VIDEO_CODEC, "-c:a", "aac",
            "-shortest", str(output_video)
        ])

        print(f"✅ short video created: {output_video}")
        sheet.update_cell(idx, 4, "short video created")

    except Exception as e:
        print(f"❌ Error processing row {idx}: {e}")
    continue

# ✅ After the entire loop is finished
if not row_found:
    print(f"✅ No rows found for {selected_date}")

# 🚀 Launch YouTube uploader
print("🚀 Launching YouTube uploader...")
try:
    subprocess.run(["python", "15_STEP5_Nasean_youtube_UPLOADER_v1.py", "--use-date-file"], check=True)
except Exception as e:
    print(f"❌ Failed to run YouTube uploader script: {e}")



    if not row_found:
        print(f"✅ No rows found for {selected_date}")

    import subprocess

    print("🚀 Launching YouTube uploader...")
    try:
        subprocess.run(["python", "15_STEP5_Nasean_youtube_UPLOADER_v1.py", "--use-date-file"], check=True)
    except Exception as e:
        print(f"❌ Failed to run YouTube uploader script: {e}")
