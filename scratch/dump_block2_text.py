import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

with open('scratch/block2_text.txt', 'w', encoding='utf-8') as f:
    for pno in range(25, 54): # pages 26 to 54 (0-indexed 25 to 53)
        page = doc[pno]
        f.write(f"\n\n=== PAGE {pno+1} ===\n\n")
        f.write(page.get_text())

print("Block 2 text dumped to scratch/block2_text.txt")
