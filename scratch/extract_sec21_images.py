import fitz
import os

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch2_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-02'
img_dir = os.path.join(ch2_dir, 'images')
os.makedirs(img_dir, exist_ok=True)

# Section 2.1 is PDF pp. 38 to 46 (0-indexed 37 to 45)
print("Extracting images for Section 2.1 (pp. 38 to 46)...")
for pno in range(37, 46):
    page = doc[pno]
    image_list = page.get_images(full=True)
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        w = base_image["width"]
        h = base_image["height"]
        filename = f"p{pno+1}_img{img_idx}_{xref}.{image_ext}"
        filepath = os.path.join(img_dir, filename)
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        print(f"Page {pno+1} (Bk {pno-22}) img {img_idx}: xref={xref}, {w}x{h} -> {filename}")
