# -*- coding: utf-8 -*-
"""
Inspect and extract all 15 figures from 2022 AHA/ACC/HFSA Heart Failure Guideline
"""

import os, pymupdf
from PIL import Image

def extract():
    doc = pymupdf.open('scratch/current_download_3.pdf')
    
    out_dir1 = 'books/guidelines/guide/chapters/chapter-14'
    out_dir2 = 'books/guidelines/guide/chapters/chapter-14/images'
    os.makedirs(out_dir1, exist_ok=True)
    os.makedirs(out_dir2, exist_ok=True)
    
    fig_info = [
        (10, 'fig01_acc_aha_stages_hf.jpg'),
        (11, 'fig02_trajectory_stage_c_hf.jpg'),
        (12, 'fig03_classification_trajectories_lvef.jpg'),
        (13, 'fig04_diagnostic_algorithm_hf.jpg'),
        (26, 'fig05_recommendations_stages_a_b.jpg'),
        (30, 'fig06_treatment_hfref_stages_c_d.jpg'),
        (46, 'fig07_additional_medical_therapies_hfref.jpg'),
        (49, 'fig08_algorithm_crt_indications.jpg'),
        (50, 'fig09_additional_device_therapies.jpg'),
        (53, 'fig10_approach_secondary_mitral_regurgitation.jpg'),
        (54, 'fig11_recommendations_hfmref.jpg'),
        (56, 'fig12_recommendations_hfpef.jpg'),
        (59, 'fig13_diagnostic_treatment_ttr_cardiac_amyloidosis.jpg'),
        (76, 'fig14_treatment_hf_selected_comorbidities.jpg'),
        (88, 'fig15_clinical_course_hf_therapies_over_time.jpg')
    ]
    
    zoom = 300 / 72
    mat = pymupdf.Matrix(zoom, zoom)
    
    for p_num, filename in fig_info:
        page = doc[p_num - 1]
        imgs = page.get_images(full=True)
        if imgs:
            # find the main figure image object rect
            main_xref = imgs[0][0]
            rects = page.get_image_rects(main_xref)
            if rects:
                rect = rects[0]
            else:
                rect = page.rect
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
