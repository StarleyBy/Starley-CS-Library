#!/usr/bin/env python3
"""
tools/check-sql-syntax.py
Проверка синтаксиса SQL и тел функций PL/pgSQL настоящим парсером PostgreSQL (библиотека pglast).
Нужна, чтобы ловить ошибки вроде «END IF без END» ДО выполнения файла в Supabase.
Не обращается к базе и сети; требует: pip install pglast  (один раз).

Использование:
  python tools/check-sql-syntax.py                      # все SQL-файлы проекта (quiz/**, supabase/**)
  python tools/check-sql-syntax.py quiz/submit_quiz_session.sql ...
Код возврата: 0 — ошибок нет; 1 — есть синтаксические ошибки; 2 — не установлен pglast.
"""
import sys, glob, os
try:
    import pglast
except ImportError:
    print('Не установлен pglast: выполните  pip install pglast'); sys.exit(2)

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
files = sys.argv[1:] or sorted(set(
    glob.glob(os.path.join(root, 'quiz', '**', '*.sql'), recursive=True) +
    glob.glob(os.path.join(root, 'supabase', '**', '*.sql'), recursive=True)))
bad = 0
for f in files:
    name = os.path.relpath(f, root).replace(os.sep, '/')
    sql = open(f, encoding='utf-8').read().replace('\r\n', '\n')
    try:
        stmts = pglast.parse_sql(sql)
    except Exception as e:
        print(f'ERROR {name}: SQL: {str(e)[:200]}'); bad += 1; continue
    problems = []
    for s in stmts:
        n = s.stmt
        if type(n).__name__ != 'CreateFunctionStmt':
            continue
        lang = [o.arg.sval for o in (n.options or []) if o.defname == 'language']
        if lang and lang[0].lower() == 'plpgsql':
            seg = sql[s.stmt_location:(s.stmt_location + s.stmt_len) if s.stmt_len else None]
            fn = '.'.join(x.sval for x in n.funcname)
            try:
                pglast.parse_plpgsql(seg)
            except Exception as e:
                problems.append(f'PL/pgSQL {fn}: {str(e)[:160]}')
    if problems:
        bad += len(problems)
        for p in problems: print(f'ERROR {name}: {p}')
    else:
        print(f'OK    {name}: {len(stmts)} операторов')
sys.exit(1 if bad else 0)
