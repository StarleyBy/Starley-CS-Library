import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

with open('scratch/exact_fig_pages_block2.txt', 'w', encoding='utf-8') as out:
    for fig in range(9, 25):
        found = []
        for pno in range(25, 55):
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

print("Saved exact fig pages!")
