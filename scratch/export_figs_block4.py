import pymupdf, os

pdf_path = 'scratch/cardio_oncology.pdf'
out_dir = r'books/guidelines/guide/chapters/chapter-10'
img_dir = os.path.join(out_dir, 'images')
os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)

# (fig_num, page_num_1indexed, rect(x0, y0, x1, y1), filename)
figures = [
    (37, 83, pymupdf.Rect(42, 55, 552, 532), "fig37_end_of_therapy_management.jpg"),
    (38, 87, pymupdf.Rect(42, 55, 552, 658), "fig38_long_term_survivor_followup.jpg"),
    (39, 92, pymupdf.Rect(42, 55, 552, 535), "fig39_cardiac_tumour_locations.jpg"),
    (40, 93, pymupdf.Rect(42, 55, 552, 388), "fig40_cardiac_masses_diagnostic_algorithm.jpg"),
    (41, 94, pymupdf.Rect(42, 55, 552, 530), "fig41_pregnant_cancer_monitoring_protocol.jpg"),
    (42, 96, pymupdf.Rect(42, 55, 552, 686), "fig42_carcinoid_heart_disease_workup.jpg"),
    (43, 97, pymupdf.Rect(42, 55, 552, 530), "fig43_al_cardiac_amyloidosis_diagnosis.jpg"),
    (44, 99, pymupdf.Rect(42, 55, 552, 528), "fig44_cied_radiotherapy_risk_stratification.jpg"),
    (45, 100, pymupdf.Rect(42, 55, 552, 542), "fig45_cied_radiotherapy_pre_treatment_pathway.jpg"),
    (46, 101, pymupdf.Rect(42, 55, 552, 542), "fig46_cied_radiotherapy_post_treatment_pathway.jpg"),
    (47, 102, pymupdf.Rect(42, 55, 552, 708), "fig47_patient_information_communication.jpg"),
    (48, 103, pymupdf.Rect(42, 55, 552, 728), "fig48_scientific_societies_role.jpg"),
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

print("All 12 figures for Block 4 exported successfully!")
