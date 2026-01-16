import whisper
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox

# --- Config ---
WHISPER_MODEL = "base"  # e.g., "base", "medium", "large"
AUDIO_FILENAME = "narration_short.mp3"
OUTPUT_FILENAME = "timestamp.txt"
USE_FIXED_SEGMENTS = True
FIXED_SEGMENT_LENGTH = 5.0

# --- GUI: Select folder ---
root = tk.Tk()
root.withdraw()
folder_selected = filedialog.askdirectory(title="Select folder with narration_short.mp3")

if not folder_selected:
    messagebox.showwarning("No Folder Selected", "You must select a folder to continue.")
    exit()

folder_path = Path(folder_selected)
audio_path = folder_path / AUDIO_FILENAME
timestamp_path = folder_path / OUTPUT_FILENAME

if not audio_path.exists():
    messagebox.showerror("Missing File", f"{AUDIO_FILENAME} not found in:\n{folder_path}")
    exit()

# --- Whisper Transcription ---
print(f"🎧 Generating timestamps for: {audio_path}")
model = whisper.load_model(WHISPER_MODEL)
result = model.transcribe(str(audio_path))

if USE_FIXED_SEGMENTS:
    print(f"📏 Using fixed {FIXED_SEGMENT_LENGTH}-second segments")
    full_text = result['text'].strip()
    audio_duration = result['segments'][-1]['end']
    num_segments = int(audio_duration // FIXED_SEGMENT_LENGTH) + 1
    words = full_text.split()
    words_per_segment = max(1, len(words) // num_segments)

    segments = []
    for i in range(num_segments):
        start_time = i * FIXED_SEGMENT_LENGTH
        end_time = min((i + 1) * FIXED_SEGMENT_LENGTH, audio_duration)
        start_idx = i * words_per_segment
        end_idx = (i + 1) * words_per_segment
        segment_text = ' '.join(words[start_idx:end_idx])
        segments.append((start_time, end_time, segment_text))

    with open(timestamp_path, "w", encoding="utf-8") as f:
        for seg in segments:
            f.write(f"[{seg[0]:.2f}s - {seg[1]:.2f}s] {seg[2]}\n")
else:
    print("🧠 Using Whisper’s native segments")
    with open(timestamp_path, "w", encoding="utf-8") as f:
        for seg in result['segments']:
            f.write(f"[{seg['start']:.2f}s - {seg['end']:.2f}s] {seg['text'].strip()}\n")

print(f"✅ Saved to {timestamp_path}")
messagebox.showinfo("Done", f"Timestamps saved to:\n{timestamp_path}")
