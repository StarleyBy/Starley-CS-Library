with open('scratch/block1_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# find all recommendation tables
recs = re.findall(r'(Recommendation\s+Table\s+\d+[^=]+?)(?=Recommendation\s+Table|\n=== PAGE|\Z)', text)
with open('scratch/block1_recs_extracted.txt', 'w', encoding='utf-8') as f:
    for r in recs:
        f.write("\n----------------------------------------\n")
        f.write(r.strip())
        f.write("\n")

print(f"Extracted {len(recs)} recommendation blocks in block 1 text")
