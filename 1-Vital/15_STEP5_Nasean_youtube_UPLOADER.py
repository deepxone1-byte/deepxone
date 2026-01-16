import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
CLIENT_SECRETS_FILE = "C:/DailyDevotionWomen/DONT_DELETE_ENV_FILES/oauth/client_secret_310102652485-4j4t2i22limqttkjnfdn948dssul81nq.apps.googleusercontent.com.json"  # <-- your OAuth JSON here

def get_authenticated_service():
    credentials = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            credentials = pickle.load(token)
    if not credentials:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
        credentials = flow.run_console()
        with open("token.pickle", "wb") as token:
            pickle.dump(credentials, token)
    return build("youtube", "v3", credentials=credentials)

def upload_video(file_path, title, description, tags=[], category_id="22", privacy_status="public"):
    youtube = get_authenticated_service()
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
    print("✅ Upload Complete")
    print("Video ID:", response["id"])

# Example usage
upload_video(
    file_path="your_video.mp4",
    title="My AI Generated Video",
    description="Created using Python and OpenAI.",
    tags=["AI", "demo", "python"],
    privacy_status="private"
)
