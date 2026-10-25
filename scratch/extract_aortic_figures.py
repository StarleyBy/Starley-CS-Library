# -*- coding: utf-8 -*-
"""
Extract all 28 figures from 2022 ACC/AHA Aortic Disease Guideline at 300 DPI
"""

import os, pymupdf
from PIL import Image

def extract():
    doc = pymupdf.open('scratch/current_download_4.pdf')
    
    out_dir1 = 'books/guidelines/guide/chapters/chapter-15'
    out_dir2 = 'books/guidelines/guide/chapters/chapter-15/images'
    os.makedirs(out_dir1, exist_ok=True)
    os.makedirs(out_dir2, exist_ok=True)
    
    # List of (page_number, filename, xref_index_or_None)
    fig_items = [
        (9, 'fig01_anatomy_aorta_branches.jpg', None),
        (10, 'fig02_histologic_features_aorta.jpg', 0),
        (10, 'fig03_eleven_landing_zones.jpg', 1),
        (11, 'fig04_freedom_ascending_aorta_events.jpg', 0),
        (11, 'fig05_relative_risk_aortic_events.jpg', 1),
        (12, 'fig06_acute_aortic_syndromes.jpg', None),
        (13, 'fig07_classification_aortic_dissection.jpg', None),
        (14, 'fig08_anatomic_reporting_dissection.jpg', None),
        (15, 'fig09_mechanisms_dynamic_static_malperfusion.jpg', None),
        (16, 'fig10_classification_taaa_crawford.jpg', None),
        (18, 'fig11_classification_endoleaks.jpg', None),
        (20, 'fig12_aortic_imaging_techniques.jpg', None),
        (21, 'fig13_orthogonal_ct_measurements.jpg', None),
        (23, 'fig14_observed_relationship_size_dissection.jpg', None),
        (24, 'fig15_predicted_risk_mortality.jpg', None),
        (26, 'fig16_management_aneurysms_root_ascending.jpg', None),
        (27, 'fig17_evaluation_genetic_testing_protocol.jpg', None),
        (39, 'fig18_monitoring_turner_syndrome.jpg', None),
        (44, 'fig19_screening_algorithm_aaa.jpg', None),
        (50, 'fig20_multidisciplinary_aortic_team.jpg', None),
        (73, 'fig21_malperfusion_treatment_options.jpg', None),
        (82, 'fig22_dimensions_pau.jpg', None),
        (84, 'fig23_classification_bttai.jpg', None),
        (87, 'fig24_abdominal_aortic_injury_zones.jpg', None),
        (97, 'fig25_eular_takayasu_arteritis.jpg', None),
        (98, 'fig26_eular_giant_cell_arteritis.jpg', None),
        (106, 'fig27_measurements_kommerell_diverticulum.jpg', None),
        (107, 'fig28_normal_bovine_aortic_arch.jpg', None)
    ]
    
    zoom = 300 / 72
    mat = pymupdf.Matrix(zoom, zoom)
    
    for p_num, filename, img_idx in fig_items:
        page = doc[p_num - 1]
        imgs = page.get_images(full=True)
        if imgs:
            if img_idx is not None and img_idx < len(imgs):
                xref = imgs[img_idx][0]
            else:
                xref = imgs[0][0]
            rects = page.get_image_rects(xref)
            rect = rects[0] if rects else page.rect
        else:
            rect = page.rect
            
        pix = page.get_pixmap(matrix=mat, clip=rect)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        p1 = os.path.join(out_dir1, filename)
        p2 = os.path.join(out_dir2, filename)
        img.save(p1, "JPEG", quality=95)
        img.save(p2, "JPEG", quality=95)
        print(f"P.{p_num} -> {filename} ({pix.width}x{pix.height}) saved.")

if __name__ == '__main__':
    extract()
