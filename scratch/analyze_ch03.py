import sys, re

with open(r'd:\IT sandbox\Starley-CS-Library\scratch\ch03_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split("=== PAGE ")
for p in pages:
    if not p.strip(): continue
    lines = [l.strip() for l in p.splitlines() if l.strip()]
    header = lines[0] if lines else ""
    # find all headers and figures on this page
    sec_headers = [l for l in lines if (l.startswith("3.") or "CHAPTER 3" in l or "Transoesophageal" in l or l.isupper()) and len(l) < 60]
    figs = [l for l in lines if re.match(r'^(Fig\.|Table|Box)', l)]
    print(f"Page {header[:15]}: Sec: {sec_headers[:2]} | Figs/Tables: {figs}")
