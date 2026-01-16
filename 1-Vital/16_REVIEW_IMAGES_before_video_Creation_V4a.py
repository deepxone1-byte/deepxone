# --- Imports ---
from openai import OpenAI
import tkinter as tk
from tkinter import filedialog, messagebox
from tkcalendar import Calendar
from pathlib import Path
from PIL import Image, ImageTk
import configparser
import requests
import subprocess
import shutil
import gspread
from google.oauth2.service_account import Credentials
import datetime
import os

# --- Load Config ---
config = configparser.ConfigParser()
config.read("DONT_DELETE_ENV_FILES/config/12_STEP2_Nasean_Generate_Image_from_prompts_short_V7.txt")

ROOT_FOLDER = config.get("DEFAULT", "ROOT_FOLDER")
OUTPUT_FOLDER = config.get("DEFAULT", "OUTPUT_FOLDER")
SYSTEM_INSTRUCTION_PATH = "DONT_DELETE_ENV_FILES/system_instructions_short.txt"
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_CREDENTIALS")

# Style Settings
style = config.get("DEFAULT", "style")
mode = config.get("DEFAULT", "mode")
guidance = config.get("DEFAULT", "guidance")
negative_guidance = config.get("DEFAULT", "negative_guidance")
always_append="simple line art, dramatic charcoal, black charcoal illustrations, storybook style, no words, no text"
system_msg = config.get("DEFAULT", "system_msg")
IMAGE_SIZE = config.get("DEFAULT", "size", fallback="1024x1024")

# --- OpenAI Client ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("❌ ERROR: OPENAI_API_KEY not set.")
    exit()
client = OpenAI(api_key=api_key)

# --- Global Variables ---
current_image_index = 0
image_list = []
timestamp_lines = []
working_folder = None
edit_log = []

# --- Script Constants ---
SCRIPT_TO_COPY = "13_StandAlone_YOUTUBE_FFMPEG_Create_Final_Video_Copy_to_Parent_Folder_v2.py"
IMAGEREGINSCRIPT_TO_COPY = "17_StandAlone_Regenerate_images_from16_Review_copy_parent_folder_v4.py"
BACKGROUND_PNG_TO_COPY = "background.png"
# --- Style Checkbox Definitions ---
style_options = [
    ("Storybook Style", "storybook style", True),
    ("Simple and Clear", "simple and clear", True),
    ("Soft", "soft", True),
    ("Imaginative", "imaginative", True),
    ("Comic Book", "comic book", False),
    ("Nature", "nature", False),
    ("No People", "no people", False),
    ("Realistic", "realistic", False),
    ("Charcoal", "charcoal", False),
    ("Watercolor", "watercolor", False)
]
style_vars = {}

# --- Setup Main Window ---
root = tk.Tk()
root.title("🖼️ Storybook Image Masterpiece Creator")
root.geometry("1080x720")

#part 1

# --- Functions ---

def select_folder():
    global working_folder, image_list, current_image_index, timestamp_lines
    folder_selected = filedialog.askdirectory(title="Select Working Folder")
    if folder_selected:
        working_folder = Path(folder_selected)
        load_selected_folder()

def load_selected_folder():
    global image_list, timestamp_lines, current_image_index
    output_folder = working_folder / OUTPUT_FOLDER
    images_folder = output_folder / "images"
    timestamp_file = output_folder / "narration_timestamps_short.txt"

    if not images_folder.exists():
        messagebox.showerror("Error", "Images folder not found.")
        return
    if not timestamp_file.exists():
        messagebox.showerror("Error", "narration_timestamps.txt not found.")
        return

    with open(timestamp_file, "r", encoding="utf-8") as f:
        timestamp_lines = f.readlines()

    image_list.clear()
    image_list.extend(sorted(images_folder.glob("*.png")))
    if not image_list:
        messagebox.showerror("Error", "No PNG images found.")
        return

    # Check if regenerate_image.txt exists and ask to replace
    output_folder.mkdir(exist_ok=True)
    regenerate_file = output_folder / "regenerate_image.txt"
    if regenerate_file.exists():
        answer = messagebox.askyesno("Replace regenerate_image.txt?",
                                     "⚠️ regenerate_image.txt already exists.\nDo you want to replace it?")
        if answer:
            regenerate_file.unlink()
            print("✅ Old regenerate_image.txt deleted.")

    prompt_settings_entry.delete(1.0, tk.END)
    prompt_settings_entry.insert(tk.END, (
        f"style={style}\n"
        f"mode={mode}\n"
        f"guidance={guidance}\n"
        f"negative_guidance={negative_guidance}\n"
        f"append={append_text}\n"
        f"system_msg={system_msg}\n"
    ))

    current_image_index = 0
    load_image()

    try:
        src_script = Path(__file__).parent / SCRIPT_TO_COPY
        dst_script = working_folder / SCRIPT_TO_COPY
        shutil.copy(src_script, dst_script)
        print(f"✅ Copied {SCRIPT_TO_COPY} to {working_folder}")
    except Exception as e:
        print(f"❌ Error copying {SCRIPT_TO_COPY}: {e}")
        messagebox.showerror("Error", f"Failed to copy {SCRIPT_TO_COPY}")
 
    try:
        src_script = Path(__file__).parent / IMAGEREGINSCRIPT_TO_COPY
        dst_script = working_folder / IMAGEREGINSCRIPT_TO_COPY
        shutil.copy(src_script, dst_script)
        print(f"✅ Copied {IMAGEREGINSCRIPT_TO_COPY} to {working_folder}")
    except Exception as e:
        print(f"❌ Error copying {IMAGEREGINSCRIPT_TO_COPY}: {e}")
        messagebox.showerror("Error", f"Failed to copy {IMAGEREGINSCRIPT_TO_COPY}")
 
  
    try:
    # Path to the background.png located in the script's folder
        src_script = Path(__file__).parent / BACKGROUND_PNG_TO_COPY
    
    # Destination path inside the output folder
        dst_script = output_folder / BACKGROUND_PNG_TO_COPY
    
    # Create the output folder if it doesn't exist
    #    OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)
    
    # Copy the file
        shutil.copy(src_script, dst_script)
    
        print(f"✅ Copied {BACKGROUND_PNG_TO_COPY} to {OUTPUT_FOLDER}")
    except Exception as e:
        print(f"❌ Error copying {BACKGROUND_PNG_TO_COPY}: {e}")
        messagebox.showerror("Error", f"Failed to copy {BACKGROUND_PNG_TO_COPY}: {e}")

def select_by_sheet():
    sheet_window = tk.Toplevel(root)
    sheet_window.title("Select Date from Sheet")

    today = datetime.datetime.today()

    cal = Calendar(sheet_window, selectmode='day',
                   year=today.year, month=today.month, day=today.day,
                   date_pattern="yyyy-mm-dd")
    cal.pack(pady=20)

    def load_from_sheet():
        selected_date = cal.get_date()
        try:
            scope = ["https://www.googleapis.com/auth/spreadsheets.readonly",
                     "https://www.googleapis.com/auth/spreadsheets",
                     "https://www.googleapis.com/auth/drive"]
            creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
            client_gsheet = gspread.authorize(creds)

            sheet = client_gsheet.open_by_key(SHEET_ID).worksheet("G6SEC")
            rows = sheet.get_all_values()
            headers = rows[0]
            data_rows = rows[1:]

            found = False
            for idx, row in enumerate(data_rows, start=2):
                row_dict = dict(zip(headers, row))
                if row_dict.get("Date", "").strip() == selected_date:
                    found = True
                    project_code = row_dict.get("Project Code", "").strip()
                    if not project_code:
                        messagebox.showerror("Error", "Project Code missing in Sheet!")
                        sheet_window.destroy()
                        return
                    sheet.update_cell(idx, 4, "Reviewing Images")  # Column D
                    folder_name = f"{project_code}-{datetime.datetime.strptime(selected_date, '%Y-%m-%d').strftime('%m-%d-%Y')}"
                    full_folder = Path(ROOT_FOLDER) / folder_name
                    if not full_folder.exists():
                        messagebox.showerror("Error", f"Folder not found: {full_folder}")
                        sheet_window.destroy()
                        return
                    global working_folder
                    working_folder = full_folder
                    load_selected_folder()
                    messagebox.showinfo("Success", f"✅ Loaded folder: {folder_name}")
                    break

            if not found:
                messagebox.showerror("Error", "Date not found in Sheet!")

        except Exception as e:
            print(f"❌ Error loading from Sheet: {e}")
            messagebox.showerror("Error", f"Failed to load from Google Sheet.")

        sheet_window.destroy()

    tk.Button(sheet_window, text="Load", command=load_from_sheet).pack(pady=10)

def flag_image_for_regeneration():
    if not working_folder:
        messagebox.showerror("Error", "No working folder selected.")
        return

    output_folder = working_folder / OUTPUT_FOLDER
    output_folder.mkdir(exist_ok=True)
    regenerate_file = output_folder / "regenerate_image.txt"

    img_path = image_list[current_image_index]
    img_name = img_path.name

    prompt_text = prompt_entry.get(1.0, tk.END).strip().replace("\n", " ")
    narration_text = narration_entry.get(1.0, tk.END).strip().replace("\n", " ")

    line = f"{img_name}||{prompt_text}||{narration_text}\n"

    with open(regenerate_file, "a", encoding="utf-8") as f:
        f.write(line)

    print(f"🚩 Flagged for regeneration: {img_name}")
    messagebox.showinfo("Flagged", f"🚩 Flagged {img_name} for batch regeneration!")

def batch_regenerate_images():
    if not working_folder:
        messagebox.showerror("Error", "No working folder selected.")
        return
    try:
        subprocess.Popen(["python", IMAGEREGINSCRIPT_TO_COPY], cwd=working_folder)
        messagebox.showinfo("Batch Started", "🚀 Batch Regenerate Started!")
    except Exception as e:
        print(f"❌ Error starting batch regeneration: {e}")
        messagebox.showerror("Error", f"Failed to start batch regeneration.")

#Part 2

def load_image():
    if not image_list:
        return
    img_path = image_list[current_image_index]
    img = Image.open(img_path)
    img.thumbnail((500, 500))
    img = ImageTk.PhotoImage(img)
    image_label.config(image=img)
    image_label.image = img
    filename_label.config(text=f"🖼️ {img_path.name} ({current_image_index+1}/{len(image_list)})")

    narration_entry.delete(1.0, tk.END)
    if current_image_index < len(timestamp_lines):
        narration_text = timestamp_lines[current_image_index].strip()
        narration_entry.insert(tk.END, narration_text)
    else:
        narration_entry.insert(tk.END, "(No narration available)")

    prompt_file = img_path.with_suffix('.txt')
    previous_prompt_entry.delete(1.0, tk.END)
    if prompt_file.exists():
        with open(prompt_file, "r", encoding="utf-8") as f:
            previous_prompt_entry.insert(tk.END, f.read())
    else:
        previous_prompt_entry.insert(tk.END, "(No previous prompt available)")

def next_image():
    global current_image_index
    if current_image_index + 1 < len(image_list):
        current_image_index += 1
        load_image()
    else:
        messagebox.showinfo("Done", "✅ All images reviewed!")

def previous_image():
    global current_image_index
    if current_image_index > 0:
        current_image_index -= 1
        load_image()
    else:
        messagebox.showinfo("Start", "⏪ This is the first image.")

def regenerate_image():
    global current_image_index
    if not image_list:
        return
    img_path = image_list[current_image_index]
    updated_prompt = prompt_entry.get(1.0, tk.END).strip()
    if not updated_prompt:
        messagebox.showwarning("Warning", "Prompt cannot be empty.")
        return
    try:
        print(f"🎨 Regenerating {img_path.name}...")
        response = client.images.generate(
            prompt=updated_prompt,
            n=1,
            size=IMAGE_SIZE,
            model="dall-e-3"
        )
        image_url = response.data[0].url
        image_data = requests.get(image_url).content

        with open(img_path, "wb") as f:
            f.write(image_data)

        messagebox.showinfo("Success", f"✅ Replaced {img_path.name}")
        edit_log.append(f"Replaced: {img_path.name}")
        next_image()

    except Exception as e:
        print(f"❌ Error regenerating {img_path.name}: {e}")
        messagebox.showerror("Error", f"Failed to regenerate {img_path.name}")

def generate_prompt_from_narration():
    narration = narration_entry.get(1.0, tk.END).strip()
    if not narration:
        messagebox.showwarning("Warning", "Narration text is empty.")
        return

    settings_raw = prompt_settings_entry.get(1.0, tk.END)
    settings = {}
    for line in settings_raw.strip().split("\n"):
        if "=" in line:
            key, value = line.split("=", 1)
            settings[key.strip()] = value.strip()

    selected_styles = [value for label, value, default in style_options if style_vars[label].get() == 1]
    style_additions = ", ".join(selected_styles)

    full_guidance = settings.get('guidance', '')
    if style_additions:
        full_guidance += ", " + style_additions

    user_msg = (
        f"Create a prompt for a {settings.get('style', '')} {settings.get('mode', '')} illustration from the following narration:\n"
        f"\"{narration}\"\n"
        f"Follow this style instruction: {full_guidance}\n"
        f"Avoid: {settings.get('negative_guidance', '')}\n"
        f"End with: {settings.get('append', '')}\n"
        f"Respond in one sentence starting with 'Prompt:'"
    )

    full_prompt = user_msg
    if len(full_prompt) > 3000:
        print(f"⚠️ Warning: Prompt too long ({len(full_prompt)} characters). Trimming.")
        full_prompt = full_prompt[:3000] + "..."

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": settings.get('system_msg', '')},
                {"role": "user", "content": full_prompt}
            ]
        )
        generated_prompt = response.choices[0].message.content.strip().replace("Prompt:", "").strip()

        prompt_entry.delete(1.0, tk.END)
        prompt_entry.insert(tk.END, generated_prompt)

    except Exception as e:
        print(f"❌ Error generating prompt: {e}")
        messagebox.showerror("Error", f"Failed to generate prompt.")

def create_video():
    if not working_folder:
        messagebox.showerror("Error", "No working folder selected.")
        return
    try:
        subprocess.Popen(["python", SCRIPT_TO_COPY], cwd=working_folder)
        messagebox.showinfo("Running", "🎬 Video creation script started!")
    except Exception as e:
        print(f"❌ Error starting video creation: {e}")
        messagebox.showerror("Error", f"Failed to start video creation.")

def save_edit_log():
    if not edit_log:
        return
    summary_path = working_folder / "edit_log.txt"
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write("\n".join(edit_log))
        f.write("\n✅ Review Completed.\n")
    print(f"✅ Edit log saved: {summary_path}")

def on_exit():
    save_edit_log()
    root.destroy()

# --- Layout ---

main_frame = tk.Frame(root)
main_frame.pack(fill=tk.BOTH, expand=True)

# Left Side (Image + Checkboxes)
left_frame = tk.Frame(main_frame)
left_frame.pack(side=tk.LEFT, padx=10, pady=10)

image_label = tk.Label(left_frame)
image_label.pack()

filename_label = tk.Label(left_frame, text="")
filename_label.pack()

checkbox_frame = tk.Frame(left_frame)
checkbox_frame.pack(pady=10)

for idx, (label, value, default) in enumerate(style_options):
    var = tk.IntVar(value=1 if default else 0)
    style_vars[label] = var
    chk = tk.Checkbutton(checkbox_frame, text=label, variable=var)
    chk.grid(row=idx//5, column=idx%5, sticky="w", padx=5, pady=2)

# Right Side (Textboxes)
right_frame = tk.Frame(main_frame)
right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)

prompt_label = tk.Label(right_frame, text="Prompt to Create the Image (Editable):")
prompt_label.pack(anchor="w")
prompt_entry = tk.Text(right_frame, height=6, wrap=tk.WORD)
prompt_entry.pack(fill=tk.BOTH, expand=True)

narration_label = tk.Label(right_frame, text="Narration from Timestamp (Reference):")
narration_label.pack(anchor="w")
narration_entry = tk.Text(right_frame, height=5, wrap=tk.WORD)
narration_entry.pack(fill=tk.BOTH, expand=True)

previous_prompt_label = tk.Label(right_frame, text="Previous Prompt (Reference Only):")
previous_prompt_label.pack(anchor="w")
previous_prompt_entry = tk.Text(right_frame, height=5, wrap=tk.WORD)
previous_prompt_entry.pack(fill=tk.BOTH, expand=True)

prompt_settings_label = tk.Label(right_frame, text="Prompt Settings (Editable):")
prompt_settings_label.pack(anchor="w")
prompt_settings_entry = tk.Text(right_frame, height=7, wrap=tk.WORD)
prompt_settings_entry.pack(fill=tk.BOTH, expand=True)

# Bottom Buttons
bottom_frame = tk.Frame(root)
bottom_frame.pack(pady=10)

select_folder_button = tk.Button(bottom_frame, text="📂 Select Working Folder", command=select_folder)
select_folder_button.grid(row=0, column=0, padx=10)

select_sheet_button = tk.Button(bottom_frame, text="📅 Select by Sheet", command=select_by_sheet)
select_sheet_button.grid(row=0, column=1, padx=10)

generate_prompt_button = tk.Button(bottom_frame, text="🎨 Generate Prompt", command=generate_prompt_from_narration)
generate_prompt_button.grid(row=0, column=2, padx=10)

regenerate_button = tk.Button(bottom_frame, text="🔄 Regenerate Image", command=regenerate_image)
regenerate_button.grid(row=0, column=3, padx=10)

create_video_button = tk.Button(bottom_frame, text="🎬 Create Video", command=create_video)
create_video_button.grid(row=0, column=4, padx=10)

flag_button = tk.Button(bottom_frame, text="🚩 Flag Image", command=flag_image_for_regeneration)
flag_button.grid(row=0, column=5, padx=10)

batch_regenerate_button = tk.Button(bottom_frame, text="🚀 Batch Regenerate", command=batch_regenerate_images)
batch_regenerate_button.grid(row=0, column=6, padx=10)

back_button = tk.Button(bottom_frame, text="⬅️ Back", command=previous_image)
back_button.grid(row=0, column=7, padx=10)

next_button = tk.Button(bottom_frame, text="➡️ Next", command=next_image)
next_button.grid(row=0, column=8, padx=10)

root.protocol("WM_DELETE_WINDOW", on_exit)
root.mainloop()
