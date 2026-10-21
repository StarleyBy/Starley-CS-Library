import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

pages = [21, 23, 24, 25]
with open('scratch/recs_1_to_4.txt', 'w', encoding='utf-8') as f:
    for p in pages:
        f.write(f"\n\n==================== PAGE {p} ====================\n\n")
        f.write(doc[p - 1].get_text())

print("Saved scratch/recs_1_to_4.txt")
