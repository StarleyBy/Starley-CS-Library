import fitz
import os

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch3_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-03'
img_dir = os.path.join(ch3_dir, 'images')
os.makedirs(img_dir, exist_ok=True)

print("Extracting images for Chapter 3 (pp. 134 to 161)...")
extracted = 0
for pno in range(133, 161):
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
        extracted += 1

print(f"Extracted {extracted} images for Chapter 3.")
