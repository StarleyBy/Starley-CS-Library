# -*- coding: utf-8 -*-
"""
Assemble Chapter 16 for books/guidelines/guide/chapters/chapter-16:
- chapter-16.md (English)
- chapter-16-ru.md (Russian)
"""
import sys, os

sys.stdout.reconfigure(encoding='utf-8')

target_dir = r"books/guidelines/guide/chapters/chapter-16"
os.makedirs(target_dir, exist_ok=True)

for lang in ['en', 'ru']:
    blocks = []
    for b in [1, 2, 3, 4]:
        fname = f"scratch/esc_hf_block{b}_{lang}.txt"
        with open(fname, "r", encoding="utf-8") as f:
            blocks.append(f.read().strip())
    
    full_content = "\n\n".join(blocks) + "\n"
    
    out_file = os.path.join(target_dir, f"chapter-16{'' if lang=='en' else '-ru'}.md")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_content)
    
    o_tag = full_content.count("<details")
    c_tag = full_content.count("</details>")
    print(f"Written {out_file}: {len(full_content.splitlines())} lines, {len(full_content)} bytes. <details>={o_tag}, </details>={c_tag}, diff={o_tag - c_tag}")

