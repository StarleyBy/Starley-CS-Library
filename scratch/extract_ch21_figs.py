import os
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\echo_04.pdf'
ch21_dir = r'd:\IT sandbox\Starley-CS-Library\books\guidelines\guide\chapters\chapter-21'
images_dir = os.path.join(ch21_dir, 'images')
os.makedirs(images_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Map of figures: (fig_num, page_num, bbox, filename)
figures = [
    (1, 6, [65.0, 74.0, 520.0, 380.0], 'fig01_11_views_basic_protocol.jpg'),
    (2, 6, [50.0, 424.0, 266.0, 670.0], 'fig02_lateral_chest_xray_probe_positions.jpg'),
    (3, 6, [309.0, 423.0, 545.0, 595.0], 'fig03_me_four_chamber_view.jpg'),
    (4, 7, [132.0, 74.0, 453.0, 313.0], 'fig04_coronary_artery_territories.jpg'),
    (5, 7, [40.0, 367.0, 276.0, 532.0], 'fig05_me_two_chamber_view.jpg'),
    (6, 7, [309.0, 369.0, 545.0, 533.0], 'fig06_me_lax_view.jpg'),
    (7, 8, [40.0, 74.0, 276.0, 250.0], 'fig07_me_ascending_aortic_lax_view.jpg'),
    (8, 8, [309.0, 74.0, 545.0, 251.0], 'fig08_me_ascending_aortic_sax_view.jpg'),
    (9, 8, [40.0, 282.0, 276.0, 459.0], 'fig09_me_av_sax_view.jpg'),
    (10, 8, [310.0, 305.0, 545.0, 471.0], 'fig10_me_rv_inflow_outflow_view.jpg'),
    (11, 9, [40.0, 74.0, 276.0, 244.0], 'fig11_me_bicaval_view.jpg'),
    (12, 9, [309.0, 74.0, 545.0, 238.0], 'fig12_tg_midpapillary_sax_view.jpg'),
    (13, 9, [40.0, 285.0, 276.0, 461.0], 'fig13_descending_aortic_sax_view.jpg'),
    (14, 9, [309.0, 272.0, 545.0, 430.0], 'fig14_descending_aortic_lax_view.jpg'),
]

zoom = 300 / 72 # 300 DPI
mat = fitz.Matrix(zoom, zoom)

for fig_num, page_num, bbox, fname in figures:
    page = doc[page_num - 1]
    rect = fitz.Rect(bbox)
    
    words_inside = [w for w in page.get_text('words') if fitz.Rect(w[:4]).intersects(rect) and w[4].strip() not in ['', '-']]
    print(f'Fig {fig_num} (Page {page_num}): rect={bbox}, words inside={len(words_inside)}')
    
    pix = page.get_pixmap(matrix=mat, clip=rect)
    
    p1 = os.path.join(ch21_dir, fname)
    p2 = os.path.join(images_dir, fname)
    pix.save(p1)
    pix.save(p2)
    print(f'Saved Fig {fig_num} -> {fname} ({pix.width}x{pix.height})')

print('All 14 figures successfully extracted!')
