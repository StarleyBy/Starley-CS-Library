# -*- coding: utf-8 -*-
"""
Extract all 5 figures for Chapter 13: 2024 AHA/ACC HCM Guideline
Saves to books/guidelines/guide/chapters/chapter-13/ and .../images/
"""

import os, pymupdf
from PIL import Image

def extract():
    doc = pymupdf.open('scratch/current_download.pdf')
    
    out_dir1 = 'books/guidelines/guide/chapters/chapter-13'
    out_dir2 = 'books/guidelines/guide/chapters/chapter-13/images'
    os.makedirs(out_dir1, exist_ok=True)
    os.makedirs(out_dir2, exist_ok=True)
    
    figures = [
        (24, 62, 'fig01_recommended_evaluation_testing_hcm.jpg'),
        (25, 66, 'fig02_genetic_testing_process_hcm.jpg'),
        (31, 84, 'fig03_patient_selection_icd_use.jpg'),
        (39, 107, 'fig04_management_symptoms_hcm.jpg'),
        (40, 111, 'fig05_heart_failure_algorithm.jpg')
    ]
    
    for p_num, xref, filename in figures:
        page = doc[p_num - 1]
        rect = page.get_image_rects(xref)[0]
        
        # Render at 300 DPI for ultra crisp quality
        zoom = 300 / 72
        mat = pymupdf.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, clip=rect)
        
        # Also check raw image
        raw_img = doc.extract_image(xref)
        raw_w, raw_h = raw_img['width'], raw_img['height']
        
        # If raw image is larger or better, we can compare
        print(f"Fig on p.{p_num} ({filename}): Rendered {pix.width}x{pix.height}, Raw {raw_w}x{raw_h}")
        
        # Save as high-quality JPEG
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        p1 = os.path.join(out_dir1, filename)
        p2 = os.path.join(out_dir2, filename)
        img.save(p1, "JPEG", quality=95)
        img.save(p2, "JPEG", quality=95)
        print(f"Saved: {p1} and {p2}")

if __name__ == '__main__':
    extract()
