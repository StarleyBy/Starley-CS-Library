with open('scratch/block4_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# find all recommendation tables in block 4
with open('scratch/block4_recs_all.txt', 'w', encoding='utf-8') as out:
    for i in range(37, 51):
        pattern = rf'Recommendation Table {i}\s*[\u2013\u2014\-].*?(?=Recommendation Table \d+|\n=== PAGE|\Z)'
        m = re.search(pattern, text, re.DOTALL)
        if m:
            out.write(f"\n==================== REC TABLE {i} ====================\n")
            out.write(m.group(0).strip())
            out.write("\n")
        else:
            out.write(f"\n==================== REC TABLE {i} NOT MATCHED WITH REGEX ====================\n")

print("Saved scratch/block4_recs_all.txt")
