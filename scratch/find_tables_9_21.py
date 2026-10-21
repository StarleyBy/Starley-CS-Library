import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

for pno in range(8, 21):
    text = doc[pno].get_text()
    for line in text.split('\n'):
        if line.strip().startswith('Table ') and not line.strip().startswith('Table of contents'):
            print(f"Page {pno+1}: {line.strip()[:100]}")
