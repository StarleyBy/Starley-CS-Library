import os, json, sys

sys.stdout.reconfigure(encoding='utf-8')
p = 'data/guidelines/aha-acs-2025'
for f in sorted(os.listdir(p)):
    if f.endswith('.json') and f != 'guideline.json':
        with open(os.path.join(p, f), 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            t_num = d.get('table_number', '')
            title = d.get('title', '')
            if isinstance(title, dict):
                title = title.get('en', '')
            print(f"{f:40} | {str(t_num):25} | {str(title)[:60]}")
