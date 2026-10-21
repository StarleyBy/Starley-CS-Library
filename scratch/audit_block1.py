import re

files = [
    r'books/guidelines/guide/chapters/chapter-10/chapter-10.md',
    r'books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    open_tags = len(re.findall(r'<details\b', text))
    close_tags = len(re.findall(r'</details>', text))
    
    # check stack trace
    lines = text.splitlines()
    stack = 0
    min_stack = 0
    for idx, line in enumerate(lines, 1):
        stack += len(re.findall(r'<details\b', line))
        stack -= len(re.findall(r'</details>', line))
        if stack < min_stack:
            min_stack = stack
    
    # check emojis
    # rough emoji unicode ranges
    emojis = re.findall(r'[\U00010000-\U0010ffff]', text)
    
    # check numerical citation brackets like [1], [1-4], [15, 23]
    citations = re.findall(r'\[\s*\d+[\s,\u2013\u2014\-0-9]*\]', text)
    
    print(f"\n--- AUDIT: {fpath} ---")
    print(f"  <details> tags: {open_tags}, </details> tags: {close_tags} (Diff: {open_tags - close_tags})")
    print(f"  Final stack: {stack}, Min stack: {min_stack}")
    print(f"  Emojis found: {len(emojis)}")
    print(f"  Citations found: {len(citations)} {citations[:5] if citations else ''}")
