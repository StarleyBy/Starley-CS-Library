import fitz
import os
import re

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch2_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-02'
img_dir = os.path.join(ch2_dir, 'images')

print("Mapping images for Section 2.2 (pp. 47 to 71)...")
for pno in range(46, 71):
    page = doc[pno]
    imgs = page.get_images()
    txt = page.get_text()
    fig_mentions = [l.strip() for l in txt.splitlines() if re.match(r'^(Fig\.|Table|Box)', l.strip())]
    print(f"P.{pno+1} (Bk {pno-22}): {len(imgs)} imgs | Captions: {fig_mentions}")
