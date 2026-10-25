import fitz
import os

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

for pno in range(24, 36):
    page = doc[pno]
    rect = page.rect
    words = page.get_text('words')
    fig_words = [w for w in words if 'fig' in w[4].lower()]
    print(f"Page {pno+1} (Bk {pno-22}):")
    for fw in fig_words:
        print(f"   Found '{fw[4]}' at rect: {fw[:4]}")
