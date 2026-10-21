import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

with open('scratch/block3_text.txt', 'w', encoding='utf-8') as f:
    for pno in range(53, 81): # pages 54 to 81 (0-indexed 53 to 80)
        page = doc[pno]
        f.write(f"\n\n=== PAGE {pno+1} ===\n\n")
        f.write(page.get_text())

print("Block 3 text dumped to scratch/block3_text.txt")
