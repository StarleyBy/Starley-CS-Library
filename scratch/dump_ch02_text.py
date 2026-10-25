import sys, fitz
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch2_text = []
for pno in range(37, 133):
    txt = doc[pno].get_text()
    ch2_text.append(f"=== PAGE {pno+1} (Bk {pno-22}) ===\n" + txt)

full_txt = "\n".join(ch2_text)
out_path = r'd:\IT sandbox\Starley-CS-Library\scratch\ch02_raw.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(full_txt)

print(f"Chapter 2 raw text dumped: {len(full_txt)} characters across {133-38+1} pages.")
