import pymupdf, os

pdf_path = 'scratch/cardio_oncology.pdf'
out_dir = r'books/guidelines/guide/chapters/chapter-10'
img_dir = os.path.join(out_dir, 'images')
os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)

# (fig_num, page_num_1indexed, rect(x0, y0, x1, y1), filename)
figures = [
    (9, 27, pymupdf.Rect(45, 55, 550, 634), "fig09_cardioprotection_strategies.jpg"),
    (10, 30, pymupdf.Rect(42, 55, 552, 536), "fig10_anthracycline_monitoring_protocol.jpg"),
    (11, 32, pymupdf.Rect(42, 55, 552, 478), "fig11_her2_surveillance_protocol.jpg"),
    (12, 34, pymupdf.Rect(45, 55, 550, 500), "fig12_vegf_inhibitor_cv_toxicities.jpg"),
    (13, 35, pymupdf.Rect(45, 55, 550, 642), "fig13_vegf_inhibitor_monitoring_protocol.jpg"),
    (14, 37, pymupdf.Rect(45, 55, 550, 412), "fig14_bcr_abl_cv_toxicities.jpg"),
    (15, 38, pymupdf.Rect(45, 55, 550, 530), "fig15_bcr_abl_monitoring_protocol.jpg"),
    (16, 40, pymupdf.Rect(40, 55, 550, 662), "fig16_multiple_myeloma_cv_toxicities.jpg"),
    (17, 41, pymupdf.Rect(42, 55, 552, 536), "fig17_multiple_myeloma_monitoring_protocol.jpg"),
    (18, 42, pymupdf.Rect(60, 55, 540, 520), "fig18_vte_risk_factors_myeloma.jpg"),
    (19, 44, pymupdf.Rect(45, 55, 550, 375), "fig19_raf_mek_inhibitors_toxicity.jpg"),
    (20, 45, pymupdf.Rect(45, 55, 550, 665), "fig20_ici_cv_surveillance.jpg"),
    (21, 47, pymupdf.Rect(45, 55, 550, 608), "fig21_adt_cv_toxicity_metabolic.jpg"),
    (22, 50, pymupdf.Rect(45, 55, 550, 380), "fig22_alk_egfr_inhibitors_toxicity.jpg"),
    (23, 52, pymupdf.Rect(45, 55, 550, 540), "fig23_radiotherapy_mean_heart_dose.jpg"),
    (24, 53, pymupdf.Rect(42, 55, 552, 418), "fig24_hsct_surveillance_protocol.jpg"),
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

print("All 16 figures for Block 2 exported successfully!")
