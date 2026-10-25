import sys, fitz, re
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

figs = []
tables = []
boxes = []

for pno in range(37, 133):
    txt = doc[pno].get_text()
    lines = txt.splitlines()
    for i, line in enumerate(lines):
        l = line.strip()
        if re.match(r'^(Fig\.|Figure)\s*\d', l):
            caption = l
            # gather following lines if part of caption
            for k in range(1, 4):
                if i + k < len(lines) and lines[i+k].strip() and not lines[i+k].strip().startswith('◆') and not lines[i+k].strip().startswith('Fig'):
                    caption += " " + lines[i+k].strip()
                else:
                    break
            figs.append((pno+1, pno-22, caption))
        elif re.match(r'^(Table)\s*\d', l):
            tables.append((pno+1, pno-22, l))
        elif re.match(r'^(Box)\s*\d', l):
            boxes.append((pno+1, pno-22, l))

print(f"Total Figures identified: {len(figs)}")
print(f"Total Tables identified: {len(tables)}")
print(f"Total Boxes identified: {len(boxes)}")

out_path = r'd:\IT sandbox\Starley-CS-Library\scratch\ch02_captions.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write("=== FIGURES ===\n")
    for p, bkp, c in figs:
        f.write(f"P.{p} (Bk {bkp}): {c}\n")
    f.write("\n=== TABLES ===\n")
    for p, bkp, t in tables:
        f.write(f"P.{p} (Bk {bkp}): {t}\n")
    f.write("\n=== BOXES ===\n")
    for p, bkp, b in boxes:
        f.write(f"P.{p} (Bk {bkp}): {b}\n")

print(f"Saved ch02_captions.txt!")
