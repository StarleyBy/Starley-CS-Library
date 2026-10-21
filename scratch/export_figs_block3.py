import pymupdf, os

pdf_path = 'scratch/cardio_oncology.pdf'
out_dir = r'books/guidelines/guide/chapters/chapter-10'
img_dir = os.path.join(out_dir, 'images')
os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)

# (fig_num, page_num_1indexed, rect(x0, y0, x1, y1), filename)
figures = [
    (25, 55, pymupdf.Rect(42, 55, 552, 655), "fig25_management_anthracycline_ctrcd.jpg"),
    (26, 57, pymupdf.Rect(42, 55, 552, 535), "fig26_management_her2_ctrcd.jpg"),
    (27, 59, pymupdf.Rect(45, 55, 550, 532), "fig27_ici_myocarditis_pathophysiology.jpg"),
    (28, 60, pymupdf.Rect(42, 55, 552, 533), "fig28_management_ici_myocarditis.jpg"),
    (29, 62, pymupdf.Rect(45, 55, 550, 698), "fig29_takotsubo_syndrome_workup.jpg"),
    (30, 67, pymupdf.Rect(45, 55, 550, 534), "fig30_atrial_fibrillation_pathophysiology.jpg"),
    (31, 68, pymupdf.Rect(42, 55, 552, 570), "fig31_atrial_fibrillation_anticoagulation_algorithm.jpg"),
    (32, 71, pymupdf.Rect(45, 55, 550, 658), "fig32_qtc_monitoring_management.jpg"),
    (33, 73, pymupdf.Rect(45, 55, 550, 715), "fig33_asymptomatic_thrombocytopenia_thresholds.jpg"),
    (34, 74, pymupdf.Rect(42, 55, 552, 363), "fig34_hypertension_treatment_algorithm.jpg"),
    (35, 75, pymupdf.Rect(45, 55, 550, 678), "fig35_vte_risk_factors_cancer.jpg"),
    (36, 76, pymupdf.Rect(42, 55, 552, 648), "fig36_anticoagulation_strategy_vte.jpg"),
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
    print(f"Exported Fig {fig_num:2d}: {fname} ({pix.width}x{pix.height}) - {os.path.getsize(p1)} bytes")

print("All 12 figures for Block 3 exported successfully!")
