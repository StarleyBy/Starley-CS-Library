import glob, json, sys
sys.stdout.reconfigure(encoding='utf-8')

for rt_num in range(18, 29):
    matches = glob.glob(f"data/guidelines/esc-hf-2026/rt{rt_num:02d}*.json")
    if matches:
        with open(matches[0], "r", encoding="utf-8") as f:
            d = json.load(f)
            num = d.get("number")
            t_en = d.get("title", {}).get("en")
            t_ru = d.get("title", {}).get("ru")
            print(f"=== {num} ===")
            print(f"EN: {t_en}")
            print(f"RU: {t_ru}")
            for sec in d.get("sections", []):
                sec_t = sec.get("title", {}).get("en")
                if sec_t and sec_t != t_en:
                    print(f"  [Section: {sec_t}]")
                for r in sec.get("rows", []):
                    txt_en = r.get("text", {}).get("en", "")[:90]
                    cls = r.get("class", "")
                    lvl = r.get("level", "")
                    print(f"    - [{cls}|{lvl}] {txt_en}...")
