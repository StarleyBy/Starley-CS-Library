import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

pages = [15, 18, 19]
with open('scratch/tables_3_4_5_actual.txt', 'w', encoding='utf-8') as f:
    for p in pages:
        f.write(f"\n\n==================== PAGE {p} ====================\n\n")
        f.write(doc[p - 1].get_text())

print("Saved scratch/tables_3_4_5_actual.txt")
