import json

with open('books/guidelines/guide/metadata.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

book = data[0] if isinstance(data, list) else data

existing = [c for c in book['chapters'] if c['file'] == 'chapter-19.md']
if not existing:
    book['chapters'].append({
        'file': 'chapter-19.md',
        'title': 'TEE to assist with surgical decision-making in the OR 2020 (ASE/SCA <span class="luminous-cyan">ECHO</span>)',
        'russian': 'ЧПЭхоКГ для принятия хирургических решений в операционной 2020 (ASE/SCA <span class="luminous-cyan">ЭХО</span>)'
    })
    with open('books/guidelines/guide/metadata.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Registered chapter-19.md in metadata.json!')
else:
    print('chapter-19.md already registered.')
