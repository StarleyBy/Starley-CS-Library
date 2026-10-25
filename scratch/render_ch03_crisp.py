import fitz
import os

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\new_book.pdf'
doc = fitz.open(pdf_path)

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-03'
img_dir = os.path.join(ch_dir, 'images')

def render_page_crop(pno, rect_box, fig_name):
    page = doc[pno]
    # rect_box in normalized (0..1) or absolute points (w, h = 555.59, 365.67)
    w, h = page.rect.width, page.rect.height
    rx0, ry0, rx1, ry1 = rect_box
    clip = fitz.Rect(rx0 * w, ry0 * h, rx1 * w, ry1 * h)
    pix = page.get_pixmap(dpi=300, clip=clip)
    p1 = os.path.join(img_dir, fig_name)
    p2 = os.path.join(ch_dir, fig_name)
    pix.save(p1)
    pix.save(p2)
    print(f"Rendered {fig_name}: {pix.width}x{pix.height}")

# Page 142 (0-indexed 141): Fig 3.1.2 Mid-esophageal probe positions & MV focus
render_page_crop(141, (0.05, 0.15, 0.95, 0.92), 'fig-03-02.jpg')

# Page 143 (0-indexed 142): Fig 3.1.3 & 3.1.4 Upper esophageal & LAA
render_page_crop(142, (0.05, 0.12, 0.95, 0.52), 'fig-03-03.jpg')
render_page_crop(142, (0.05, 0.54, 0.95, 0.94), 'fig-03-04.jpg')

# Page 144 (0-indexed 143): Fig 3.1.5, 3.1.6, 3.1.7 Pulmonary artery, Right atrium, Transgastric
render_page_crop(143, (0.05, 0.10, 0.95, 0.40), 'fig-03-05.jpg')
render_page_crop(143, (0.05, 0.41, 0.95, 0.70), 'fig-03-06.jpg')
render_page_crop(143, (0.05, 0.71, 0.95, 0.98), 'fig-03-07.jpg')

print("Crisp page renders completed for Figures 3.1.2 - 3.1.7!")
