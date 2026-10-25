import fitz, sys, re
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open(r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\echo_04.pdf')

for i, page in enumerate(doc):
    text = page.get_text()
    for m in re.finditer(r'^[ \t]*Figure\s+(\d+)\b[.:\s]+([^\n]+)', text, re.MULTILINE):
        num = int(m.group(1))
        il = page.get_image_info(xrefs=True)
        print(f'Fig {num} (Page {i+1}): {m.group(2)[:60]}')
        for item in il:
            b = item.get('bbox')
            print(f'   Xref {item.get("xref")}: [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]')
