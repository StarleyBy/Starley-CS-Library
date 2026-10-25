import sys, fitz, re
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch3_text = []
ch3_figs = []
total_imgs = 0

for pno in range(133, 161):
    page = doc[pno]
    txt = page.get_text()
    imgs = page.get_images()
    total_imgs += len(imgs)
    ch3_text.append(f"=== PAGE {pno+1} (Bk {pno-22}) ===\n" + txt)
    for line in txt.splitlines():
        l = line.strip()
        if re.match(r'^(Fig\.|Table|Box)', l):
            ch3_figs.append((pno+1, pno-22, l))

full_txt = "\n".join(ch3_text)
out_txt = r'd:\IT sandbox\Starley-CS-Library\scratch\ch03_raw.txt'
with open(out_txt, 'w', encoding='utf-8') as f:
    f.write(full_txt)

print(f"Chapter 3: {len(full_txt)} chars across {161-134+1} pages.")
print(f"Total embedded images: {total_imgs}")
print(f"Total captions: {len(ch3_figs)}")
for p, bkp, c in ch3_figs[:25]:
    print(f"  P.{p} (Bk {bkp}): {c}")
