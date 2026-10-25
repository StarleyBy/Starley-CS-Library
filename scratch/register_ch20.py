import json

with open('books/guidelines/guide/metadata.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

book = data[0] if isinstance(data, list) else data

existing = [c for c in book['chapters'] if c['file'] == 'chapter-20.md']
if not existing:
    book['chapters'].append({
        'file': 'chapter-20.md',
        'title': 'Comprehensive transesophageal <span class="luminous-cyan">ECHO</span>cardiographic examination 2013 (ASE/SCA)',
        'russian': 'Комплексное чреспищеводное <span class="luminous-cyan">ЭХО</span>кардиографическое исследование 2013 (ASE/SCA)'
    })
    with open('books/guidelines/guide/metadata.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Registered chapter-20.md in metadata.json!')
else:
    print('chapter-20.md already registered.')
