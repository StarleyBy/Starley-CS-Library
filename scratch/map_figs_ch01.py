import fitz
import os

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

# Let's inspect each page's text lines that start with 'Fig.' and look at images on that page
for pno in range(24, 36):
    page = doc[pno]
    text = page.get_text()
    fig_lines = [l.strip() for l in text.splitlines() if l.strip().startswith('Fig.')]
    imgs = page.get_images()
    print(f"=== Page {pno+1} (Bk {pno-22}) ===")
    print("  Figures mentioned:", fig_lines)
    print(f"  Embedded images count: {len(imgs)}")
    for i, im in enumerate(imgs):
        xref = im[0]
        base_im = doc.extract_image(xref)
        print(f"    img {i}: xref {xref}, {base_im['width']}x{base_im['height']}, {base_im['ext']}")
