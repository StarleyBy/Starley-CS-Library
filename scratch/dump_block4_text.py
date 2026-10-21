import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

with open('scratch/block4_text.txt', 'w', encoding='utf-8') as f:
    for pno in range(80, 114): # pages 81 to 114 (0-indexed 80 to 113)
        page = doc[pno]
        f.write(f"\n\n=== PAGE {pno+1} ===\n\n")
        f.write(page.get_text())

print("Block 4 text dumped to scratch/block4_text.txt")
