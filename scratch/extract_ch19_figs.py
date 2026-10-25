import os
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\echo_02.pdf'
ch19_dir = r'd:\IT sandbox\Starley-CS-Library\books\guidelines\guide\chapters\chapter-19'
images_dir = os.path.join(ch19_dir, 'images')
os.makedirs(images_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Map of figures: (fig_num, page_num, bbox, filename)
# Bounding boxes matched to image xref bboxes with 1-2 pt padding
figures = [
    (1, 5, [59.0, 74.0, 526.0, 252.0], 'fig01_3d_mitral_valve_en_face.jpg'),
    (2, 5, [44.0, 307.0, 272.0, 511.0], 'fig02_sam_risk_measurements.jpg'),
    (3, 9, [59.0, 301.0, 526.0, 471.0], 'fig03_me_aortic_valve_endoballoon.jpg'),
    (4, 11, [44.0, 74.0, 272.0, 309.0], 'fig04_aortic_root_measurements.jpg'),
    (5, 18, [107.0, 74.0, 478.0, 333.0], 'fig05_pre_lvad_imaging_strategy.jpg'),
    (6, 18, [59.0, 392.0, 526.0, 677.0], 'fig06_lvad_inflow_cannula_assessment.jpg'),
    (7, 19, [107.0, 74.0, 478.0, 321.0], 'fig07_post_lvad_imaging_strategy.jpg'),
    (8, 21, [59.0, 74.0, 526.0, 391.0], 'fig08_percutaneous_rvad_assessment.jpg'),
    (9, 23, [107.0, 74.0, 478.0, 242.0], 'fig09_pre_bi_vad_imaging_strategy.jpg'),
    (10, 23, [107.0, 296.0, 478.0, 526.0], 'fig10_post_bi_vad_imaging_strategy.jpg'),
    (11, 24, [107.0, 287.0, 478.0, 576.0], 'fig11_pre_tah_imaging_strategy.jpg'),
    (12, 25, [107.0, 74.0, 478.0, 280.0], 'fig12_post_tah_imaging_strategy.jpg'),
    (13, 27, [59.0, 74.0, 526.0, 390.0], 'fig13_hcm_sam_septal_reduction.jpg'),
    (14, 29, [59.0, 394.0, 526.0, 514.0], 'fig14_heart_transplant_bicaval_anastomosis.jpg'),
    (15, 31, [59.0, 74.0, 526.0, 191.0], 'fig15_lung_transplant_pv_anastomosis.jpg'),
]

zoom = 300 / 72 # 300 DPI
mat = fitz.Matrix(zoom, zoom)

for fig_num, page_num, bbox, fname in figures:
    page = doc[page_num - 1]
    rect = fitz.Rect(bbox)
    
    # Check if any text words lie inside the crop
    words_inside = [w for w in page.get_text('words') if fitz.Rect(w[:4]).intersects(rect) and w[4].strip() not in ['', '-']]
    # We want to make sure page body text / captions are not inside
    # If the image itself has labels (A, B, C, LAX), that's fine, but let's see how many words are there
    print(f'Fig {fig_num} (Page {page_num}): rect={bbox}, words inside={len(words_inside)}')
    
    pix = page.get_pixmap(matrix=mat, clip=rect)
    
    # Save to both chapter-19/ and chapter-19/images/
    p1 = os.path.join(ch19_dir, fname)
    p2 = os.path.join(images_dir, fname)
    pix.save(p1)
    pix.save(p2)
    print(f'Saved Fig {fig_num} -> {fname} ({pix.width}x{pix.height})')

print('All 15 figures successfully extracted!')
