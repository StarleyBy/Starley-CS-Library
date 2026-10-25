# -*- coding: utf-8 -*-
"""
Extract all 11 figures from 2025 ACC/AHA ACS Guidelines at 300 DPI master quality
and save as JPG to books/guidelines/guide/chapters/chapter-12/ and images/
"""

import os, fitz
from PIL import Image
import io

doc = fitz.open('scratch/next_guideline.pdf')

fig_pages = [
    (1, 9, 'fig01_pathobiology_type1_mi.jpg'),
    (2, 11, 'fig02_types_classification_acs.jpg'),
    (3, 14, 'fig03_initial_assessment_suspected_acs.jpg'),
    (4, 20, 'fig04_initial_choice_p2y12_inhibitor.jpg'),
    (5, 28, 'fig05_lipid_lowering_therapy_acs.jpg'),
    (6, 32, 'fig06_care_system_pathway_ischemic_symptoms.jpg'),
    (7, 38, 'fig07_selection_routine_vs_selective_invasive.jpg'),
    (8, 40, 'fig08_selection_timing_invasive_strategy_nste_acs.jpg'),
    (9, 49, 'fig09_mechanical_complications_mi.jpg'),
    (10, 56, 'fig10_core_components_cardiac_rehab.jpg'),
    (11, 58, 'fig11_dapt_strategies_first_12_months.jpg')
]

out_dir1 = 'books/guidelines/guide/chapters/chapter-12'
out_dir2 = 'books/guidelines/guide/chapters/chapter-12/images'
os.makedirs(out_dir1, exist_ok=True)
os.makedirs(out_dir2, exist_ok=True)

for fnum, p, fname in fig_pages:
    page = doc[p - 1]
    il = page.get_images()
    assert len(il) >= 1, f"No image on page {p}"
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    img_bytes = base_img['image']
    
    # Open with PIL and convert to RGB JPG
    img = Image.open(io.BytesIO(img_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    p1 = os.path.join(out_dir1, fname)
    p2 = os.path.join(out_dir2, fname)
    img.save(p1, format='JPEG', quality=95)
    img.save(p2, format='JPEG', quality=95)
    
    print(f"Extracted Fig {fnum} (Page {p}): {fname} [{img.width}x{img.height}]")

print("All 11 figures extracted successfully!")
