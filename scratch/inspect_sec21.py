import sys, fitz
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

print("=== SECTION 2.1 (pp. 38 to 46) ===")
sec21_text = []
for pno in range(37, 46):
    txt = doc[pno].get_text()
    sec21_text.append(f"--- Page {pno+1} (Bk {pno-22}) ---\n" + txt)

print("\n".join(sec21_text)[:4000])
