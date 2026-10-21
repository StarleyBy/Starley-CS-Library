import pymupdf, sys

doc = pymupdf.open('scratch/cardio_oncology.pdf')
# Search only in Block 1 pages: 8 to 27 (0-indexed 7 to 26)
for fig_num in range(1, 9):
    print(f"--- Figure {fig_num} ---", flush=True)
    for pno in range(7, 27):
        page = doc[pno]
        rects = page.search_for(f"Figure {fig_num}")
        if rects:
            for r in rects:
                # also print text line near r
                print(f"  Page {pno+1}: rect={r}", flush=True)
print("Done!", flush=True)
