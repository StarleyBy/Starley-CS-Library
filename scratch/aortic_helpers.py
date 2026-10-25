# -*- coding: utf-8 -*-
"""
Helper utilities for 2022 ACC/AHA Aortic Disease Guideline markdown generation
Loads and converts JSON recommendation tables and clinical tables from data/guidelines/aha-aortic-2022/
"""

import os, json, re

DATA_DIR = 'data/guidelines/aha-aortic-2022'

def clean_text(txt):
    if not txt:
        return ''
    t = re.sub(r'\^\[[^\]]+\]', '', str(txt))
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def clean_rt_num(filename, num_str):
    m = re.search(r'rt(\d+)', filename)
    if m:
        return str(int(m.group(1)))
    m2 = re.search(r'\d+', str(num_str))
    return m2.group(0) if m2 else str(num_str)

def clean_table_num(filename, num_str):
    m = re.search(r't(\d+)', filename)
    if m:
        return str(int(m.group(1)))
    m2 = re.search(r'\d+', str(num_str))
    return m2.group(0) if m2 else str(num_str)

def render_rt_en(filename):
    data = load_json(filename)
    out = []
    
    title = data.get('title', {}).get('en', '') if isinstance(data.get('title'), dict) else data.get('title', '')
    rt_num = clean_rt_num(filename, data.get('number', ''))
    
    out.append(f"### Recommendation Table {rt_num} — {title}\n")
    
    sections = data.get('sections', [])
    if not sections:
        return '\n'.join(out)
        
    for s in sections:
        stitle = s.get('title', {}).get('en', '') if isinstance(s.get('title'), dict) else s.get('title', '')
        if stitle:
            out.append(f"**{stitle}**\n")
            
        out.append("| Recommendations | Class | Level |")
        out.append("|---|:---:|:---:|")
        
        for r in s.get('rows', []):
            rec_text = clean_text(r.get('text', {}).get('en', ''))
            cor = r.get('class', '')
            loe = r.get('level', '')
            out.append(f"| {rec_text} | **{cor}** | **{loe}** |")
        out.append("")
        
    return '\n'.join(out)

def render_rt_ru(filename):
    data = load_json(filename)
    out = []
    
    title = data.get('title', {}).get('ru', '') if isinstance(data.get('title'), dict) else data.get('title', '')
    rt_num = clean_rt_num(filename, data.get('number', ''))
    
    out.append(f"### Таблица рекомендаций {rt_num} — {title}\n")
    
    sections = data.get('sections', [])
    if not sections:
        return '\n'.join(out)
        
    for s in sections:
        stitle = s.get('title', {}).get('ru', '') if isinstance(s.get('title'), dict) else s.get('title', '')
        if stitle:
            out.append(f"**{stitle}**\n")
            
        out.append("| Рекомендации | Класс | Уровень |")
        out.append("|---|:---:|:---:|")
        
        for r in s.get('rows', []):
            rec_text = clean_text(r.get('text', {}).get('ru', ''))
            cor = r.get('class', '')
            loe = r.get('level', '')
            out.append(f"| {rec_text} | **{cor}** | **{loe}** |")
        out.append("")
        
    return '\n'.join(out)

def render_table_en(filename):
    data = load_json(filename)
    out = []
    
    title = data.get('title', {}).get('en', '') if isinstance(data.get('title'), dict) else data.get('title', '')
    t_num = clean_table_num(filename, data.get('number', ''))
    
    out.append(f"#### Table {t_num}: {title}\n")
    
    cols = [clean_text(c['title']['en']) for c in data.get('columns', [])]
    out.append("| " + " | ".join(cols) + " |")
    out.append("|" + "|".join(["---"] * len(cols)) + "|")
    
    for r in data.get('rows', []):
        cells = [clean_text(c['text']['en']) for c in r.get('cells', [])]
        out.append("| " + " | ".join(cells) + " |")
        
    out.append("")
    return '\n'.join(out)

def render_table_ru(filename):
    data = load_json(filename)
    out = []
    
    title = data.get('title', {}).get('ru', '') if isinstance(data.get('title'), dict) else data.get('title', '')
    t_num = clean_table_num(filename, data.get('number', ''))
    
    out.append(f"#### Таблица {t_num}: {title}\n")
    
    cols = [clean_text(c['title']['ru']) for c in data.get('columns', [])]
    out.append("| " + " | ".join(cols) + " |")
    out.append("|" + "|".join(["---"] * len(cols)) + "|")
    
    for r in data.get('rows', []):
        cells = [clean_text(c['text']['ru']) for c in r.get('cells', [])]
        out.append("| " + " | ".join(cells) + " |")
        
    out.append("")
    return '\n'.join(out)
