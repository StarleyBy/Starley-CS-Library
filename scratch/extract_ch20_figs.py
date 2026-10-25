import os
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\echo_03.pdf'
ch20_dir = r'd:\IT sandbox\Starley-CS-Library\books\guidelines\guide\chapters\chapter-20'
images_dir = os.path.join(ch20_dir, 'images')
os.makedirs(images_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Map of figures: (fig_num, page_num, bbox, filename)
figures = [
    (1, 11, [131.0, 74.0, 455.0, 237.0], 'fig01_probe_manipulation_terminology.jpg'),
    (2, 12, [40.0, 74.0, 276.0, 611.0], 'fig02_2d_tee_conventions_views.jpg'),
    (3, 13, [59.0, 74.0, 526.0, 547.0], 'fig03_multiplane_views_28_cross_sections.jpg'),
    (4, 18, [130.0, 74.0, 455.0, 413.0], 'fig04_mitral_scallops_carpentier.jpg'),
    (5, 21, [130.0, 74.0, 455.0, 307.0], 'fig05_3d_acquisition_mitral_narrow_angle.jpg'),
    (6, 21, [130.0, 341.0, 455.0, 569.0], 'fig06_3d_acquisition_mitral_wide_angle.jpg'),
    (7, 23, [32.0, 74.0, 553.0, 460.0], 'fig07_mitral_en_face_surgeon_view.jpg'),
    (8, 25, [309.0, 74.0, 545.0, 293.0], 'fig08_aortic_valve_me_sax.jpg'),
    (9, 27, [131.0, 74.0, 455.0, 413.0], 'fig09_2d_vs_3d_aortic_annulus_sizing.jpg'),
    (10, 28, [131.0, 74.0, 455.0, 379.0], 'fig10_3d_aortic_root_and_ascending_aorta.jpg'),
    (11, 29, [309.0, 74.0, 545.0, 611.0], 'fig11_pulmonic_valve_imaging_views.jpg'),
    (12, 30, [131.0, 74.0, 454.0, 242.0], 'fig12_tricuspid_valve_modified_bicaval.jpg'),
    (13, 31, [40.0, 74.0, 276.0, 249.0], 'fig13_3d_tricuspid_valve_wide_angle.jpg'),
    (14, 32, [59.0, 74.0, 526.0, 219.0], 'fig14_lv_wall_thickness_internal_dimensions.jpg'),
    (15, 34, [131.0, 74.0, 454.0, 328.0], 'fig15_left_atrial_appendage_views.jpg'),
    (16, 35, [131.0, 74.0, 454.0, 219.0], 'fig16_coronary_sinus_views.jpg'),
    (17, 35, [131.0, 283.0, 454.0, 413.0], 'fig17_bicaval_ivc_eustachian_chiari.jpg'),
    (18, 36, [131.0, 74.0, 454.0, 552.0], 'fig18_saline_contrast_shunt_pfo.jpg'),
    (19, 37, [309.0, 74.0, 545.0, 348.0], 'fig19_3d_atrial_septal_defect_assessment.jpg'),
]

zoom = 300 / 72 # 300 DPI
mat = fitz.Matrix(zoom, zoom)

for fig_num, page_num, bbox, fname in figures:
    page = doc[page_num - 1]
    rect = fitz.Rect(bbox)
    
    words_inside = [w for w in page.get_text('words') if fitz.Rect(w[:4]).intersects(rect) and w[4].strip() not in ['', '-']]
    print(f'Fig {fig_num} (Page {page_num}): rect={bbox}, words inside={len(words_inside)}')
    
    pix = page.get_pixmap(matrix=mat, clip=rect)
    
    p1 = os.path.join(ch20_dir, fname)
    p2 = os.path.join(images_dir, fname)
    pix.save(p1)
    pix.save(p2)
    print(f'Saved Fig {fig_num} -> {fname} ({pix.width}x{pix.height})')

print('All 19 figures successfully extracted!')
