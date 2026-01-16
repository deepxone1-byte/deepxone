from pathlib import Path

# 🔧 Set this to the folder containing your images and text files
target_folder = Path("C:/1-Vital/Course_Collective/VITAL6-SEC-L9-01-09-2025/output/images")  # ← change this

# 🔁 Rename all 3-digit numbered files to 5-digit format
for file in target_folder.glob("*"):
    stem = file.stem
    if stem.isdigit() and len(stem) == 3:
        new_stem = f"{int(stem):05}"
        new_file = file.with_name(f"{new_stem}{file.suffix}")
        print(f"🔁 Renaming {file.name} → {new_file.name}")
        file.rename(new_file)

print("✅ Done renaming.")
