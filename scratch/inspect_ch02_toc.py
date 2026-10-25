import sys, fitz
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

# Chapter 2 is PDF pages 38 to 133 (0-indexed 37 to 132)
# Book pages 15 to 110
print(f"Total pages in Ch2: {133 - 38 + 1}")

toc = doc.get_toc()
ch2_toc = [item for item in toc if 38 <= item[2] <= 133]
print("TOC items in Ch2:")
for item in ch2_toc:
    print(f"  Level {item[0]} | p.{item[2]} (Bk {item[2]-22}): {item[1]}")
