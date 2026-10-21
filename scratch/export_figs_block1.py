import pymupdf, os

pdf_path = 'scratch/cardio_oncology.pdf'
out_dir = r'books/guidelines/guide/chapters/chapter-10'
img_dir = os.path.join(out_dir, 'images')
os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)

# (fig_num, page_num_1indexed, rect(x0, y0, x1, y1), filename)
figures = [
    (1, 11, pymupdf.Rect(90, 56, 510, 450), "fig01_dynamics_cv_toxicity_risk.jpg"),
    (2, 12, pymupdf.Rect(65, 62, 525, 534), "fig02_cardio_oncology_care_pathways.jpg"),
    (3, 13, pymupdf.Rect(82, 62, 518, 508), "fig03_baseline_cv_toxicity_checklist.jpg"),
    (4, 14, pymupdf.Rect(72, 56, 518, 514), "fig04_dimensions_ctr_cvt_severity.jpg"),
    (5, 17, pymupdf.Rect(66, 56, 534, 534), "fig05_baseline_cv_risk_stratification.jpg"),
    (6, 20, pymupdf.Rect(62, 56, 528, 534), "fig06_hfa_icos_approach_referral.jpg"),
    (7, 22, pymupdf.Rect(105, 56, 485, 576), "fig07_baseline_screening_recommendations.jpg"),
    (8, 24, pymupdf.Rect(40, 52, 475, 648), "fig08_tte_cmr_monitoring_protocol.jpg"),
]

zoom = 300 / 72  # 300 DPI
mat = pymupdf.Matrix(zoom, zoom)

for fig_num, pno, rect, fname in figures:
    page = doc[pno - 1]
    pix = page.get_pixmap(matrix=mat, clip=rect)
    p1 = os.path.join(out_dir, fname)
    p2 = os.path.join(img_dir, fname)
    pix.save(p1)
    pix.save(p2)
    print(f"Exported Fig {fig_num}: {fname} ({pix.width}x{pix.height}) - {os.path.getsize(p1)} bytes")

print("All 8 figures for Block 1 exported successfully!")
