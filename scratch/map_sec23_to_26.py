import fitz
import os
import re

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

sections = [
    ("Sec 2.3 Functional", 71, 90),
    ("Sec 2.4 3D Echo", 90, 110),
    ("Sec 2.5 Contrast", 110, 123),
    ("Sec 2.6 Storage & Report", 123, 133)
]

for name, s_idx, e_idx in sections:
    print(f"\n=== {name} (pp. {s_idx+1} to {e_idx}) ===")
    for pno in range(s_idx, e_idx):
        page = doc[pno]
        imgs = page.get_images()
        txt = page.get_text()
        caps = [l.strip() for l in txt.splitlines() if re.match(r'^(Fig\.|Table|Box)', l.strip())]
        if caps or imgs:
            print(f"  P.{pno+1} (Bk {pno-22}): {len(imgs)} imgs | {caps}")
