import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open(r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\echo_02.pdf')

pages = [5, 9, 11, 18, 19, 21, 23, 24, 25, 27, 29, 31]
for p in pages:
    page = doc[p-1]
    il = page.get_image_info(xrefs=True)
    text_blocks = page.get_text('blocks')
    print(f'=== Page {p} (w={page.rect.width}, h={page.rect.height}) ===')
    for b in text_blocks:
        txt = b[4].strip().replace('\n', ' ')
        if 'Figure' in txt:
            print(f'  Text Caption: [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}] -> {txt[:80]}')
    for item in il:
        b = item.get('bbox')
        print(f'  Image Xref {item.get("xref")}: [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]')
