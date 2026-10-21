import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')
with open('scratch/block1_text.txt', 'w', encoding='utf-8') as f:
    for pno in range(0, 26):
        page = doc[pno]
        f.write(f"\n\n=== PAGE {pno+1} ===\n\n")
        f.write(page.get_text())

print("Block 1 text dumped to scratch/block1_text.txt")
