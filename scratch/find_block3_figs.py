import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

with open('scratch/exact_fig_pages_block3.txt', 'w', encoding='utf-8') as out:
    for fig in range(25, 37):
        found = []
        for pno in range(53, 80): # pages 54 to 80 (0-indexed 53 to 79)
            page = doc[pno]
            rects = page.search_for(f"Figure {fig}")
            for r in rects:
                if r.x0 < 60: # start of caption at left margin
                    found.append((pno + 1, r))
        if found:
            for p, r in found:
                out.write(f"Figure {fig:2d} -> Page {p:2d}, caption y0={r.y0:.1f}\n")
        else:
            out.write(f"Figure {fig:2d} -> NOT FOUND\n")

print("Saved exact fig pages for Block 3!")
