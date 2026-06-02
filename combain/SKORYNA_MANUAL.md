# Комбайн Ф. Скорины — Инструкция по использованию
**Версия 4.1**

---

## Структура рабочих папок

```
C:/MD/
├── new/        ← сюда кладём PDF + config перед запуском
├── books/      ← временные PDF-главы (создаются автоматически)
├── output/     ← результаты Marker (MD + изображения по папкам)
├── ready/      ← ✅ готовые книги для переноса в GitHub
├── done/       ← архив обработанных исходников
└── combiner.log
```

---

## Форматы конфиг-файла

Конфиг-файл называется: `<имя_PDF>-config.txt`  
Например, для `book.pdf` → `book-config.txt`

### Тип 1 — Простая книга (flat): только главы

```
filename: book.pdf
title: Cardiac Surgery
author: Kirklin, Barratt-Boyes
categories: cardiac surgery

chapters:
1|1 Anatomy and Dimensions|17-43
2|2 Hypothermia, Circulatory Arrest, and Cardiopulmonary Bypass|44-99
3|3 Myocardial Management During Cardiac Surgery|100-120
```

**Результат в ready/:**
```
book/
  chapters/
    chapter-01/
      chapter-01.md
      images/
    chapter-02/
      chapter-02.md
  cover.jpg
  metadata.json
```

**metadata.json:**
```json
[{
  "structure": "flat",
  "chapters": [
    { "file": "chapter-01.md", "title": "1. Anatomy and Dimensions" },
    { "file": "chapter-02.md", "title": "2. Hypothermia..." }
  ]
}]
```

---

### Тип 2 — Иерархическая книга (nested): секции → подглавы

```
filename: book.pdf
title: Hurst's The Heart
author: Fuster V.
categories: cardiology

chapters:
1|Section 1 Cardiovascular Disease: Past, Present, and Future|42-105
  1.1|1. A History of the Cardiac Diseases|44
  1.2|2. The Global Burden of Cardiovascular Diseases|60
  1.3|3. Assessing and Improving the Quality of Care|93
2|Section 2 Foundations of Cardiovascular Medicine|106-263
  2.1|4. Functional Anatomy of the Heart|108
  2.2|5. Normal Physiology of the Cardiovascular System|142
```

**Правила:**
- Строки **без отступа** = секции верхнего уровня
- Строки **с отступом** (пробелы или таб) = подглавы
- Страницы у секций — информационные; PDF нарезается **только для подглав**

**Результат в ready/ (совместим с reader.html subchapters):**
```
book/
  chapters/
    chapter-01/
      chapter-01.md          ← заглушка секции (reader не отображает)
      chapter-01-01.md       ← подглава 1.1
      chapter-01-02.md       ← подглава 1.2
      chapter-01-03.md       ← подглава 1.3
      images/                ← общие изображения всей секции
    chapter-02/
      chapter-02.md
      chapter-02-01.md
      chapter-02-02.md
      images/
  cover.jpg
  metadata.json
```

**metadata.json:**
```json
[{
  "structure": "nested",
  "chapters": [
    {
      "file": "chapter-01.md",
      "title": "1. Section 1 Cardiovascular Disease...",
      "subchapters": [
        { "file": "chapter-01-01.md", "title": "1.1. A History of the Cardiac Diseases" },
        { "file": "chapter-01-02.md", "title": "1.2. The Global Burden..." },
        { "file": "chapter-01-03.md", "title": "1.3. Assessing and Improving..." }
      ]
    },
    {
      "file": "chapter-02.md",
      "title": "2. Section 2 Foundations...",
      "subchapters": [...]
    }
  ]
}]
```

---

### Приложения (для обоих типов)

Глава с названием, начинающимся на `appendix` (регистр неважен), попадает в `appendices`:

```
chapters:
...
A|Appendix A: Normal Values|850-860
```

Результат: `chapters/appendix-0a/appendix-0a.md` + запись в `metadata.appendices`.

---

## Запуск

### Стандартный запуск

1. Поместить `book.pdf` и `book-config.txt` в `C:/MD/new/`
2. Запустить:
   ```
   python skoryna_combiner.py
   ```
3. Готовая книга появится в `C:/MD/ready/book/`

### Режим планировщика (проверка каждые 4 ч)
```
python skoryna_combiner.py --schedule
```

### Только стадия 1 — нарезка PDF
```
python skoryna_combiner.py --stage1 book-config.txt
```
Создаёт PDF-главы в `books/`. Запусти Marker вручную, затем стадию 3.

### Только стадия 3 — финальная сборка
```
python skoryna_combiner.py --stage3 book-config.txt
```
Собирает `ready/` из уже готового `output/`.

### Восстановление из output
```
python skoryna_combiner.py --recover book
```
Требует наличия `done/book/book-summary.txt`.

---

## Типичный рабочий процесс

```
C:/MD/new/
  ├── book.pdf
  └── book-config.txt
          ↓
  python skoryna_combiner.py
          ↓
  [Stage 1] Нарезка PDF на подглавы → C:/MD/books/
          ↓
  [Stage 2] Marker → C:/MD/output/book-01-01/, book-01-02/, ...
          ↓
  [Stage 3] Сборка + заглушки + images/ → C:/MD/ready/book/
          ↓
  Исходники → C:/MD/done/book/
          ↓
  Копируем C:/MD/ready/book/ в GitHub-проект
```

---

## Именование файлов

| Номер в конфиге | Тип | Папка | MD-файл |
|---|---|---|---|
| `5` (flat) | глава | `chapter-05/` | `chapter-05.md` |
| `12` (flat) | глава | `chapter-12/` | `chapter-12.md` |
| `1` (nested, секция) | заглушка | `chapter-01/` | `chapter-01.md` |
| `1.3` (nested, подглава) | подглава | `chapter-01/` | `chapter-01-03.md` |
| `10.12` (nested) | подглава | `chapter-10/` | `chapter-10-12.md` |

---

## Зависимости

```
pip install PyPDF2 pdf2image schedule
```

Также требуется:
- **Marker** в PATH (`marker_single`)
- **Poppler** по пути `C:\poppler\Library\bin`

---

## Настройки в коде

| Параметр | По умолчанию | Описание |
|---|---|---|
| `remove_citations` | `True` | Удалять числовые ссылки из MD |
| `base_dir` | `C:/MD` | Корневая рабочая папка |
| Путь Poppler | `C:\poppler\Library\bin` | Метод `create_cover()` |
