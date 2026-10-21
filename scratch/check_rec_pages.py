import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')
# pages 20 to 26 (0-indexed 19 to 25)
for pno in range(19, 26):
    text = doc[pno].get_text()
    print(f"\n==================== PAGE {pno+1} ====================")
    for line in text.split('\n'):
        if 'Recommendation Table' in line or 'Class' in line or 'Level' in line:
            print(f"  {line.strip()}")
