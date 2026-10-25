# -*- coding: utf-8 -*-
import fitz, os, sys
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('scratch/next_guideline.pdf')
dpi = 300
zoom = dpi / 72.0
mat = fitz.Matrix(zoom, zoom)

test_crops = [
    (2, 17, 265, 658, "fig02_stages_classifications_hf.jpg"),
    (3, 18, 330, 722, "fig03_nomenclature_hf_therapies.jpg"),
    (7, 28, 255, 700, "fig07_multiparametric_aetiology_assessment.jpg"),
    (8, 29, 368, 714, "fig08_diagnosis_ischaemic_hf.jpg"),
    (10, 40, 366, 658, "fig10_indications_crt.jpg"),
    (19, 61, 215, 674, "fig19_management_cad_in_hf.jpg"),
]

os.makedirs('scratch/test_crops', exist_ok=True)

for fnum, pno, y_top, y_bottom, fname in test_crops:
    page = doc[pno - 1]
    crop_rect = fitz.Rect(32, y_top, 565, y_bottom)
    pix = page.get_pixmap(matrix=mat, clip=crop_rect)
    out_path = f"scratch/test_crops/{fname}"
    pix.save(out_path)
    with Image.open(out_path) as img:
        w, h = img.size
        print(f"Fig {fnum:02d} cropped: {w}x{h} (aspect ratio {w/h:.2f}) -> {out_path}")

print("Test crops generated.")
