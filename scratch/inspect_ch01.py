import sys, fitz
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

print('=== CHAPTER 1 IMAGES ===')
for pno in range(23, 37):
    page = doc[pno]
    imgs = page.get_images()
    for idx, img_info in enumerate(imgs):
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        w = base_img["width"]
        h = base_img["height"]
        ext = base_img["ext"]
        print(f"Page {pno+1} (Book p. {pno-22}) img {idx}: xref={xref}, ext={ext}, w={w}, h={h}")

print('\n=== CHAPTER 1 TEXT SNIPPETS ===')
for pno in range(23, 37):
    lines = [l.strip() for l in doc[pno].get_text().splitlines() if l.strip()]
    headers = [l for l in lines if l.startswith('Box') or l.startswith('Fig') or l.startswith('Table') or l.isupper() or len(l) < 40][:4]
    print(f"P.{pno+1} (Bk {pno-22}): {headers}")
