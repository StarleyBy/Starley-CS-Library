import fitz
import os
from PIL import Image

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-01'
img_dir = os.path.join(ch_dir, 'images')

# Let's inspect page 26 (Bk 3) rect
p26 = doc[25] # 0-indexed 25 is Page 26
pix = p26.get_pixmap(dpi=200)
pix.save(os.path.join(r'd:\IT sandbox\Starley-CS-Library\scratch', 'page26_rendered.jpg'))
print('Page 26 rendered:', pix.width, 'x', pix.height)
