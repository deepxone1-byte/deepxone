import os
import pickle
from pathlib import Path
from datetime import datetime
import argparse
import configparser
import gspread
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials
import tkinter as tk
from tkcalendar import Calendar

# === Load config file ===
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/15_STEP5_Nasean_youtube_UPLOADER_v1.txt")

ROOT_FOLDER = Path(__file__).resolve().parent / "Course_Collective"
OUTPUT_VIDEO = config.get("DEFAULT", "OUTPUT_VIDEO", fallback="output/final_videov.mp4")
CLIENT_SECRETS_FILE = config.get("DEFAULT", "CLIENT_SECRETS_FILE")

SERVICE_ACCOUNT_FILE = os.getenv("SMARTIKLE_WORKBOOK_GOOGLE_CREDENTIALS")
SHEET_ID = "1iuQ53zJSD5b9QtGkEw74RfHHbMLbau0Bliv5r4bsIxs"
WORKSHEET_NAME = "G6VIR-short"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly"
]

def get_authenticated_service():
    credentials = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            credentials = pickle.load(token)
    if not credentials:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
        credentials = flow.run_local_server(port=0)
        with open("token.pickle", "wb") as token:
            pickle.dump(credentials, token)
    return build("youtube", "v3", credentials=credentials)

def get_channel_info(youtube):
    try:
        response = youtube.channels().list(part="snippet", mine=True).execute()
        if "items" in response and response["items"]:
            channel = response["items"][0]
            name = channel["snippet"]["title"]
            channel_id = channel["id"]
            print(f"📺t Uploading to YouTube channel: {name} (ID: {channel_id})")
        else:
            print("⚠️ Could not retrieve channel information.")
    except Exception as e:
        print(f"❌ Failed to retrieve channel info: {e}")

def upload_video(file_path, title, description, tags=[], category_id="22", privacy_status="private"):
    youtube = get_authenticated_service()
    get_channel_info(youtube)
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": category_id,
        },
        "status": {
            "privacyStatus": privacy_status,
        }
    }

    media = MediaFileUpload(file_path, chunksize=-1, resumable=True, mimetype="video/*")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploaded {int(status.progress() * 100)}%")
    video_id = response["id"]
    print("✅ Upload Complete")
    print("Video ID:", video_id)
    return video_id

# === Date selection ===
parser = argparse.ArgumentParser()
parser.add_argument("--use-date-file", action="store_true")
args = parser.parse_args()
selected_date = None

if args.use_date_file:
    date_file = Path("selected_date.txt")
    if not date_file.exists():
        print("❌ selected_date.txt not found.")
        exit()
    selected_date = date_file.read_text().strip()
else:
    selected_date_holder = []
    def on_submit():
        selected_date_holder.append(cal.get_date())
        root.destroy()
    root = tk.Tk()
    root.title("Select a Date")
    cal = Calendar(root, selectmode='day', date_pattern="yyyy-mm-dd")
    cal.pack(pady=20)
    tk.Button(root, text="Start", command=on_submit).pack(pady=10)
    root.mainloop()
    if not selected_date_holder:
        print("❌ No date selected.")
        exit()
    selected_date = selected_date_holder[0]

Path("selected_date.txt").write_text(selected_date)

# === Locate matching row ===
scope = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets"
]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
client = gspread.authorize(creds)
sheet = client.open_by_key(SHEET_ID).worksheet(WORKSHEET_NAME)
rows = sheet.get_all_values()

for idx, row in enumerate(rows[1:], start=2):
    if len(row) < 10:
        continue

    row_date = row[9].strip()
    status = row[3].strip().lower()
    label = row[2].strip()

    if row_date < selected_date:
        continue

    print(f"🔍 Row {idx} — Date: {row_date}, Status: '{status}', Label: '{label}'")

    if status == "stop creating":
        print(f"🛑 STOP CREATING found at row {idx}. Exiting.")
        break

    if status != "short video created":
        print(f"⏭️ Skipping row {idx} — Status is '{status}'")
        continue

    folder_name = f"{label}-{datetime.strptime(row_date, '%Y-%m-%d').strftime('%m-%d-%Y')}"
    output_folder = ROOT_FOLDER / folder_name / "output"
    video_path = output_folder / Path(OUTPUT_VIDEO).name
    title_path = output_folder / "youtubetitle.txt"
    desc_path = output_folder / "youtubedescription.txt"

    if not video_path.exists():
        print(f"❌ Video file not found: {video_path}")
        exit()

    if not title_path.exists():
        print(f"⚠️ Title file missing: {title_path}")
    if not desc_path.exists():
        print(f"⚠️ Description file missing: {desc_path}")

    title = title_path.read_text(encoding="utf-8").strip() if title_path.exists() else "Auto-generated Video"
    description = desc_path.read_text(encoding="utf-8").strip() if desc_path.exists() else "Uploaded via automation"

    video_id = upload_video(
        file_path=str(video_path),
        title=title,
        description=description,
        tags=["AI", "automated", "narration"],
        privacy_status="private"
    )

    try:
        sheet.update_cell(idx, 6, f"https://youtu.be/{video_id}")  # Column F
        sheet.update_cell(idx, 4, "short video posted youtube")    # Column D
        print(f"✅ Updated sheet for row {idx}")
    except Exception as e:
        print(f"❌ Failed to update Google Sheet for row {idx}: {e}")
