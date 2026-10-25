import sys, fitz
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

total_images = 0
ch2_figs = []
for pno in range(37, 133): # PDF pages 38 to 133 (0-indexed 37 to 132)
    page = doc[pno]
    imgs = page.get_images()
    total_images += len(imgs)
    txt = page.get_text()
    for line in txt.splitlines():
        line_s = line.strip()
        if line_s.startswith('Fig.') or line_s.startswith('Table') or line_s.startswith('Box'):
            ch2_figs.append((pno+1, pno-22, line_s))

print(f"Chapter 2 total embedded images: {total_images}")
print(f"Chapter 2 total captioned items: {len(ch2_figs)}")
for p, bkp, item in ch2_figs[:35]:
    print(f"P.{p} (Bk {bkp}): {item}")
