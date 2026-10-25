import glob, json

for rt_num in range(18, 29):
    matches = glob.glob(f"data/guidelines/esc-hf-2026/rt{rt_num:02d}*.json")
    if matches:
        with open(matches[0], "r", encoding="utf-8") as f:
            d = json.load(f)
            print(f"RT {rt_num}: {d.get('table_number')} | {d.get('title_en')} | {len(d.get('recommendations', []))} recs")

matches = glob.glob("data/guidelines/esc-hf-2026/t20*.json")
if matches:
    with open(matches[0], "r", encoding="utf-8") as f:
        d = json.load(f)
        print(f"Table 20: {d.get('table_number')} | {d.get('title_en')}")
