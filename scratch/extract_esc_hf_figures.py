# -*- coding: utf-8 -*-
"""
Extract all 23 figures from scratch/next_guideline.pdf at master 300 DPI resolution
with clean bounding boxes excluding page headers, footers, and surrounding article text.
"""
import fitz, os, sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

DEST_DIRS = [
    'books/guidelines/guide/chapters/chapter-16',
    'books/guidelines/guide/chapters/chapter-16/images'
]

# Define figures: (fnum, page_num_1based, y_top, y_bottom, filename)
FIGURES = [
    (1,  10, 36,  471, "fig01_central_illustration_hf_management.jpg"),
    (2,  17, 265, 658, "fig02_stages_classifications_hf.jpg"),
    (3,  18, 330, 722, "fig03_nomenclature_hf_therapies.jpg"),
    (4,  23, 36,  669, "fig04_diagnostic_algorithm_chronic_hf.jpg"),
    (5,  26, 36,  606, "fig05_contributing_causes_hfref.jpg"),
    (6,  27, 36,  614, "fig06_risk_factors_hfpef.jpg"),
    (7,  28, 255, 700, "fig07_multiparametric_aetiology_assessment.jpg"),
    (8,  29, 368, 714, "fig08_diagnosis_ischaemic_hf.jpg"),
    (9,  31, 36,  537, "fig09_arrhythmia_associated_hf.jpg"),
    (10, 40, 366, 658, "fig10_indications_crt.jpg"),
    (11, 43, 36,  529, "fig11_diagnosing_decompensated_hf.jpg"),
    (12, 45, 36,  471, "fig12_phases_goals_inhospital_management.jpg"),
    (13, 46, 36,  405, "fig13_initial_management_dhf.jpg"),
    (14, 47, 36,  472, "fig14_tools_assessment_decongestion.jpg"),
    (15, 49, 36,  654, "fig15_management_decongestion.jpg"),
    (16, 53, 36,  337, "fig16_triage_timely_referral_advanced_hf.jpg"),
    (17, 55, 36,  573, "fig17_intermacs_classification.jpg"),
    (18, 56, 36,  498, "fig18_treatment_advanced_hf.jpg"),
    (19, 61, 215, 674, "fig19_management_cad_in_hf.jpg"),
    (20, 63, 36,  416, "fig20_management_secondary_mr.jpg"),
    (21, 70, 36,  721, "fig21_core_members_hf_team.jpg"),
    (22, 73, 36,  422, "fig22_long_term_followup_stable_hf.jpg"),
    (23, 76, 36,  673, "fig23_diagnosis_treatment_cardiac_amyloidosis.jpg"),
]

def extract_all():
    for d in DEST_DIRS:
        os.makedirs(d, exist_ok=True)

    doc = fitz.open('scratch/next_guideline.pdf')
    dpi = 300
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    for fnum, pno, y_top, y_bottom, fname in FIGURES:
        page = doc[pno - 1]
        crop_rect = fitz.Rect(32, y_top, 565, y_bottom)
        pix = page.get_pixmap(matrix=mat, clip=crop_rect)
        
        temp_path = f"scratch/temp_fig{fnum:02d}.png"
        pix.save(temp_path)
        
        with Image.open(temp_path) as img:
            img_rgb = img.convert('RGB')
            w, h = img_rgb.size
            for d in DEST_DIRS:
                out_file = os.path.join(d, fname)
                img_rgb.save(out_file, "JPEG", quality=95, optimize=True)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"Extracted Fig {fnum:02d} (p.{pno:02d}, y={y_top}..{y_bottom}): {w}x{h} -> {fname}")

    print("\nAll 23 figures extracted and cropped successfully!")

if __name__ == '__main__':
    extract_all()
