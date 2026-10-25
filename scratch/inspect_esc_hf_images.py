# -*- coding: utf-8 -*-
import fitz

doc = fitz.open('scratch/next_guideline.pdf')
print('PyMuPDF opened. Page count:', len(doc))

check_pages = [9, 16, 17, 20, 22, 23, 24, 25, 26, 27, 28, 29, 39, 41, 42, 43, 44, 45, 46, 47, 51, 54, 55, 60, 62, 68, 72, 75]
for pno in check_pages:
    page = doc[pno]
    images = page.get_images()
    print(f'Page {pno+1}: {len(images)} images')
    for img_idx, img in enumerate(images):
        xref = img[0]
        base_img = doc.extract_image(xref)
        w, h = base_img['width'], base_img['height']
        ext = base_img['ext']
        sz = len(base_img['image'])
        print(f"   img {img_idx}: xref={xref}, {w}x{h}, {ext}, {sz:,} bytes")
