"""
Комбайн Ф. Скорины — автоматизированная обработка книг
Версия 4.1

Поддерживает два типа структуры книги:
  - Простая (flat): только главы
  - Иерархическая (nested): секции, внутри которых подглавы

Формат конфига (flat):
    chapters:
    1|Chapter Title|17-43
    2|Chapter Title|44-99

Формат конфига (nested):
    chapters:
    1|Section Title|17-105
      1.1|Sub-Chapter Title|17-43
      1.2|Sub-Chapter Title|44-105
    2|Section Title|106-200
      2.1|Sub-Chapter Title|106-150

Выходная структура (nested, совместима с reader.html subchapters):
    chapters/
      chapter-01/
        chapter-01.md          ← заглушка секции (не отображается)
        chapter-01-01.md       ← подглава
        chapter-01-02.md       ← подглава
        images/                ← общие изображения всей секции
"""

import os
import json
import shutil
import subprocess
import time
import threading
import re
from pathlib import Path
from datetime import datetime
from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_path
import schedule
import logging
from queue import Queue


# ─────────────────────────────────────────────────────────────────────────────
# Логирование
# ─────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('C:/MD/combiner.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# Вспомогательные функции
# ─────────────────────────────────────────────────────────────────────────────

def slugify_num(num_str: str) -> str:
    """
    Преобразует номер главы/секции в безопасную строку для имени файла.
    '1'    → '01'
    '1.1'  → '01-01'
    '1.12' → '01-12'
    '10.2' → '10-02'
    """
    parts = num_str.strip().split('.')
    return '-'.join(p.zfill(2) for p in parts)


def is_section_line(line: str) -> bool:
    """Возвращает True, если строка — секция верхнего уровня (без отступа)."""
    return not line.startswith(' ') and '|' in line


def is_chapter_line(line: str) -> bool:
    """Возвращает True, если строка — глава (с отступом)."""
    return line.startswith(' ') and '|' in line


def detect_structure(chapter_lines: list) -> str:
    """
    Определяет тип структуры конфига: 'flat' или 'nested'.
    nested — если есть хотя бы одна строка с отступом.
    """
    for line in chapter_lines:
        if is_chapter_line(line):
            return 'nested'
    return 'flat'


# ─────────────────────────────────────────────────────────────────────────────
# Основной класс
# ─────────────────────────────────────────────────────────────────────────────

class SkorynaCombiner:

    def __init__(self):
        self.base_dir  = Path("C:/MD")
        self.new_dir   = self.base_dir / "new"
        self.books_dir = self.base_dir / "books"
        self.output_dir= self.base_dir / "output"
        self.ready_dir = self.base_dir / "ready"
        self.temp_dir  = self.base_dir / "temp"
        self.done_dir  = self.base_dir / "done"
        self.state_file= self.base_dir / "combiner_state.json"

        for d in [self.new_dir, self.books_dir, self.output_dir,
                  self.ready_dir, self.temp_dir, self.done_dir]:
            d.mkdir(parents=True, exist_ok=True)

        self.processing_queue = Queue()
        self.marker_running   = False
        self.marker_lock      = threading.Lock()

        # Удаление числовых ссылок на литературу в MD
        self.remove_citations = True

        self.load_state()

    # ── Состояние ─────────────────────────────────────────────────────────────

    def load_state(self):
        if self.state_file.exists():
            with open(self.state_file, 'r', encoding='utf-8') as f:
                self.state = json.load(f)
        else:
            self.state = {"books": {}, "last_run": None}

    def save_state(self):
        self.state["last_run"] = datetime.now().isoformat()
        with open(self.state_file, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, indent=2, ensure_ascii=False)

    def update_book_stage(self, book_name, stage, status="in_progress"):
        self.state["books"].setdefault(book_name, {})
        self.state["books"][book_name].update({
            "current_stage": stage,
            "status": status,
            "updated": datetime.now().isoformat()
        })
        self.save_state()

    # ── Парсинг конфига ────────────────────────────────────────────────────────

    def parse_config(self, config_path: Path) -> dict:
        """
        Парсит конфигурационный файл книги.

        Возвращает dict с ключами:
            filename, title, author, categories,
            structure  : 'flat' | 'nested'
            sections   : список секций (только для nested)
                каждая секция: {num, title, pages, chapters: [...]}
            chapters   : список глав (только для flat)
                каждая глава: {num, title, pages}
            appendices : список приложений (flat, всегда)
        """
        config = {
            'filename'  : '',
            'title'     : 'Untitled Book',
            'author'    : '',
            'categories': [],
            'structure' : 'flat',
            'sections'  : [],   # только nested
            'chapters'  : [],   # только flat
            'appendices': [],
        }

        chapter_lines = []   # сырые строки после заголовка "chapters:"
        in_chapters   = False

        with open(config_path, 'r', encoding='utf-8') as f:
            raw_lines = f.readlines()

        for line in raw_lines:
            stripped = line.rstrip('\n')
            content  = stripped.strip()

            if not content or content.startswith('#'):
                continue

            if in_chapters:
                # Собираем строки с отступом и без — всё, что имеет '|'
                if '|' in stripped:
                    chapter_lines.append(stripped)
                continue

            if content.startswith('filename:'):
                config['filename'] = content.split(':', 1)[1].strip()
            elif content.startswith('title:'):
                config['title'] = content.split(':', 1)[1].strip() or 'Untitled Book'
            elif content.startswith('author:'):
                config['author'] = content.split(':', 1)[1].strip()
            elif content.startswith('categories:'):
                cats = content.split(':', 1)[1].strip()
                config['categories'] = [c.strip() for c in cats.split(',') if c.strip()]
            elif content.startswith('chapters:'):
                in_chapters = True

        # Определяем тип структуры
        structure = detect_structure(chapter_lines)
        config['structure'] = structure

        if structure == 'flat':
            self._parse_flat(chapter_lines, config)
        else:
            self._parse_nested(chapter_lines, config)

        return config

    def _parse_flat(self, lines: list, config: dict):
        """Заполняет config['chapters'] и config['appendices'] для flat-книги."""
        for line in lines:
            parts = line.strip().split('|')
            if len(parts) != 3:
                continue
            num, title, pages = (p.strip() for p in parts)
            entry = {'num': num, 'title': title, 'pages': pages}
            if title.lower().startswith('appendix'):
                config['appendices'].append(entry)
            else:
                config['chapters'].append(entry)

    def _parse_nested(self, lines: list, config: dict):
        """Заполняет config['sections'] для nested-книги."""
        current_section = None

        for line in lines:
            parts = line.strip().split('|')
            if len(parts) != 3:
                continue
            num, title, pages = (p.strip() for p in parts)

            if is_chapter_line(line):
                # Подглава: отступ есть → принадлежит текущей секции
                if current_section is None:
                    # Защита: секция не объявлена — создаём виртуальную
                    current_section = {'num': '0', 'title': '', 'pages': pages, 'chapters': []}
                    config['sections'].append(current_section)
                entry = {'num': num, 'title': title, 'pages': pages}
                if title.lower().startswith('appendix'):
                    config['appendices'].append(entry)
                else:
                    current_section['chapters'].append(entry)
            else:
                # Секция верхнего уровня (без отступа)
                current_section = {
                    'num'     : num,
                    'title'   : title,
                    'pages'   : pages,
                    'chapters': []
                }
                config['sections'].append(current_section)

    # ── Список "атомарных" глав для обработки ─────────────────────────────────

    def get_leaf_chapters(self, config: dict) -> list:
        """
        Возвращает плоский список всех листовых глав (тех, что нарезаются как PDF).

        Для flat  — это config['chapters'] + config['appendices'].
        Для nested — это все chapter'ы внутри sections + config['appendices'].

        Каждый элемент: {num, title, pages, section_num?, section_title?}
        """
        leaves = []

        if config['structure'] == 'flat':
            for ch in config['chapters']:
                leaves.append(dict(ch))
            for ap in config['appendices']:
                ap2 = dict(ap)
                ap2['is_appendix'] = True
                leaves.append(ap2)
        else:
            for sec in config['sections']:
                for ch in sec['chapters']:
                    ch2 = dict(ch)
                    ch2['section_num']   = sec['num']
                    ch2['section_title'] = sec['title']
                    leaves.append(ch2)
            for ap in config['appendices']:
                ap2 = dict(ap)
                ap2['is_appendix'] = True
                leaves.append(ap2)

        return leaves

    # ── Имена файлов ──────────────────────────────────────────────────────────

    def chapter_file_stem(self, book_name: str, chapter: dict) -> str:
        """
        Возвращает stem имени файла для главы (без расширения).

        flat   : bookname-01
        nested : bookname-01-02   (секция-глава)
        appendix: bookname-appendix-01
        """
        is_app = chapter.get('is_appendix', False)
        num    = chapter['num']

        if is_app:
            return f"{book_name}-appendix-{slugify_num(num)}"

        slug = slugify_num(num)
        return f"{book_name}-{slug}"

    # ── Нарезка PDF ───────────────────────────────────────────────────────────

    def split_pdf_by_pages(self, pdf_path: Path, book_name: str, chapters: list) -> list:
        """
        Нарезает PDF на части согласно списку leaf-глав.
        Возвращает список созданных Path-объектов.
        """
        logging.info(f"Нарезка PDF: {pdf_path.name} → {len(chapters)} файлов")
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
        created = []

        for chapter in chapters:
            pages = chapter['pages']
            stem  = self.chapter_file_stem(book_name, chapter)

            # Парсинг диапазона страниц
            if '-' in pages:
                start_str, end_str = pages.split('-', 1)
                start_page = int(start_str) - 1
                end_page   = int(end_str)
            else:
                start_page = int(pages) - 1
                end_page   = start_page + 1

            # Проверка границ
            start_page = max(0, start_page)
            end_page   = min(end_page, total_pages)

            writer = PdfWriter()
            for p in range(start_page, end_page):
                writer.add_page(reader.pages[p])

            out_path = self.books_dir / f"{stem}.pdf"
            with open(out_path, 'wb') as fout:
                writer.write(fout)

            created.append(out_path)
            logging.info(f"  ✓ {out_path.name}  (стр. {start_page+1}–{end_page})")

        return created

    # ── Обложка ───────────────────────────────────────────────────────────────

    def create_cover(self, pdf_path: Path, book_name: str) -> bool:
        logging.info(f"Создание обложки: {book_name}")
        try:
            poppler_path = r"C:\poppler\Library\bin"
            images = convert_from_path(
                pdf_path, first_page=1, last_page=1,
                dpi=150, poppler_path=poppler_path
            )
            if images:
                cover_path = self.books_dir / f"{book_name}-cover.jpg"
                images[0].save(cover_path, 'JPEG')
                logging.info(f"  ✓ Обложка: {cover_path.name}")
                return True
        except Exception as e:
            logging.error(f"Ошибка обложки: {e}")
            logging.error("Убедитесь, что Poppler установлен в C:\\poppler\\Library\\bin")
        return False

    # ── Summary ───────────────────────────────────────────────────────────────

    def create_summary(self, book_name: str, config: dict):
        """Сохраняет краткий текстовый отчёт о структуре книги."""
        summary_path = self.books_dir / f"{book_name}-summary.txt"

        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(f"книга: {book_name}\n")
            f.write(f"название: {config['title']}\n")
            f.write(f"автор: {config['author']}\n")
            f.write(f"структура: {config['structure']}\n\n")

            if config['structure'] == 'flat':
                f.write("главы:\n")
                for ch in config['chapters']:
                    f.write(f"  chapter {ch['num']}, \"{ch['title']}\"\n")
            else:
                f.write("секции и главы:\n")
                for sec in config['sections']:
                    f.write(f"  section {sec['num']}, \"{sec['title']}\"\n")
                    for ch in sec['chapters']:
                        f.write(f"    chapter {ch['num']}, \"{ch['title']}\"\n")

            if config['appendices']:
                f.write("\nприложения:\n")
                for ap in config['appendices']:
                    f.write(f"  appendix {ap['num']}, \"{ap['title']}\"\n")

        logging.info(f"  ✓ Summary: {summary_path.name}")

    # ── Пост-обработка MD ─────────────────────────────────────────────────────

    def remove_citation_numbers(self, text: str) -> str:
        """Удаляет числовые ссылки на литературу из MD-текста."""
        patterns = [
            r'\s+\d+(?:,\s*\d+)+(?=\s|$|\.|,)',   # "23,24" или "1, 2, 3"
            r'\s+\d+-\d+(?=\s|$|\.|,)',            # "1-5"
            r'\s*\[\d+(?:,\s*\d+)*\]',             # "[23]" или "[1,2,3]"
            r'\s*\(\d+(?:,\s*\d+)*\)',             # "(23)" или "(1,2,3)"
        ]
        result = text
        for pat in patterns:
            result = re.sub(pat, '', result)
        return result

    def postprocess_chapter(self, md_file: Path):
        """Применяет пост-обработку к MD-файлу (удаление ссылок)."""
        if not self.remove_citations:
            return
        try:
            text = md_file.read_text(encoding='utf-8')
            cleaned = self.remove_citation_numbers(text)
            md_file.write_text(cleaned, encoding='utf-8')
            logging.info(f"  ✓ Пост-обработка: {md_file.name}")
        except Exception as e:
            logging.error(f"Ошибка пост-обработки {md_file}: {e}")

    # ── Marker ────────────────────────────────────────────────────────────────

    def wait_for_marker_output(self, expected_stems: list,
                                timeout=3600, check_interval=10) -> bool:
        """Ждёт появления MD-файлов от Marker."""
        logging.info(f"Ожидание Marker: {len(expected_stems)} глав...")
        start    = time.time()
        completed= set()

        while time.time() - start < timeout:
            for stem in expected_stems:
                if stem in completed:
                    continue
                md_file = self.output_dir / stem / f"{stem}.md"
                if md_file.exists():
                    completed.add(stem)
                    logging.info(f"  ✓ Marker: {stem}  ({len(completed)}/{len(expected_stems)})")
                    # Удаляем PDF-главу — она больше не нужна
                    pdf = self.books_dir / f"{stem}.pdf"
                    if pdf.exists():
                        pdf.unlink()

            if len(completed) == len(expected_stems):
                logging.info("Все главы обработаны Marker'ом!")
                return True

            time.sleep(check_interval)

        missing = set(expected_stems) - completed
        logging.warning(f"Таймаут Marker. Не обработаны: {missing}")
        return False

    def run_marker(self, expected_stems: list):
        """Запускает Marker через PowerShell и ждёт результатов."""
        with self.marker_lock:
            self.marker_running = True
        try:
            logging.info("Запуск Marker...")
            ps_script = (
                '$input = "C:\\\\MD\\\\books"; $out = "C:\\\\MD\\\\output"; '
                'Get-ChildItem -Path $input -Filter *.pdf | ForEach-Object { '
                'Write-Host "→ $($_.Name)"; '
                'marker_single "$($_.FullName)" --output_dir "$out" }'
            )
            result = subprocess.run(
                ["powershell", "-Command", ps_script],
                check=True, capture_output=True, text=True, encoding='utf-8'
            )
            if result.stdout:
                logging.info(result.stdout)
            self.wait_for_marker_output(expected_stems)
        except subprocess.CalledProcessError as e:
            logging.error(f"Ошибка Marker: {e}")
            if e.stderr:
                logging.error(e.stderr)
        except Exception as e:
            logging.error(f"Неожиданная ошибка Marker: {e}")
        finally:
            with self.marker_lock:
                self.marker_running = False

    # ── Финальная сборка ──────────────────────────────────────────────────────

    def assemble_final_structure(self, book_name: str, config: dict):
        """
        Собирает финальную структуру книги в папку ready/<book_name>/.

        flat:
            chapters/chapter-01/chapter-01.md
            chapters/chapter-01/images/

        nested (совместимо с reader.html subchapters):
            chapters/chapter-01/chapter-01.md        ← заглушка секции
            chapters/chapter-01/chapter-01-01.md     ← подглава
            chapters/chapter-01/chapter-01-02.md     ← подглава
            chapters/chapter-01/images/              ← общие изображения

        metadata.json:
            flat   → chapters: [{file, title}, ...]
            nested → chapters: [{file, title, subchapters: [{file, title}, ...]}, ...]
        """
        logging.info(f"Сборка структуры: {book_name}  [{config['structure']}]")

        book_dir = self.ready_dir / book_name
        book_dir.mkdir(exist_ok=True)

        chapters_dir = book_dir / "chapters"
        chapters_dir.mkdir(exist_ok=True)

        # Обложка
        cover_src = self.books_dir / f"{book_name}-cover.jpg"
        if cover_src.exists():
            shutil.copy(cover_src, book_dir / "cover.jpg")

        # Метаданные — единая схема для обоих типов
        metadata = {
            "title"      : config['title'],
            "cover_image": "cover.jpg",
            "category"   : config['categories'],
            "authors"    : [config['author']],
            "structure"  : config['structure'],
            "chapters"   : [],
            "appendices" : []
        }

        if config['structure'] == 'flat':
            self._assemble_flat(book_name, config, chapters_dir, metadata)
        else:
            self._assemble_nested(book_name, config, chapters_dir, metadata)

        # Приложения (общие для обоих типов)
        self._assemble_appendices(book_name, config, chapters_dir, metadata)

        # metadata.json
        with open(book_dir / "metadata.json", 'w', encoding='utf-8') as f:
            json.dump([metadata], f, indent=2, ensure_ascii=False)

        logging.info(f"✓ Книга собрана: {book_dir}")

    def _copy_md(self, stem: str, md_dst: Path) -> bool:
        """
        Копирует MD-файл из output/<stem>/<stem>.md в md_dst и применяет пост-обработку.
        Возвращает True если файл найден.
        """
        md_src = self.output_dir / stem / f"{stem}.md"
        if md_src.exists():
            shutil.copy(md_src, md_dst)
            self.postprocess_chapter(md_dst)
            return True
        logging.warning(f"MD не найден: {md_src}")
        return False

    def _copy_images(self, stem: str, images_dir: Path):
        """
        Копирует все изображения из output/<stem>/ в images_dir.
        Папка images_dir создаётся только если есть хоть одно изображение.
        """
        src_dir  = self.output_dir / stem
        if not src_dir.exists():
            return
        img_exts = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}
        imgs = [p for p in src_dir.iterdir()
                if p.is_file() and p.suffix.lower() in img_exts]
        if imgs:
            images_dir.mkdir(parents=True, exist_ok=True)
            for img in imgs:
                shutil.copy(img, images_dir / img.name)
            logging.info(f"  ✓ {len(imgs)} изображений → {images_dir.parent.name}/images/")

    def _copy_chapter_files(self, stem: str, dest_dir: Path):
        """
        Совместимый метод для flat-глав и приложений:
        копирует MD и изображения, оба в dest_dir.
        """
        md_dst = dest_dir / f"{dest_dir.name}.md"
        self._copy_md(stem, md_dst)
        self._copy_images(stem, dest_dir / "images")

    def _assemble_flat(self, book_name, config, chapters_dir, metadata):
        """Сборка flat-книги."""
        for ch in config['chapters']:
            stem     = self.chapter_file_stem(book_name, ch)
            slug     = slugify_num(ch['num'])
            ch_dir   = chapters_dir / f"chapter-{slug}"
            ch_dir.mkdir(exist_ok=True)
            self._copy_chapter_files(stem, ch_dir)
            metadata['chapters'].append({
                "file" : f"chapter-{slug}.md",
                "title": f"{ch['num']}. {ch['title']}"
            })

    def _make_section_stub(self, sec: dict, ch_dir: Path, sec_slug: str):
        """
        Создаёт заглушку chapter-XX.md для секции.
        Файл не отображается reader'ом, но должен присутствовать.
        """
        stub_path = ch_dir / f"chapter-{sec_slug}.md"
        lines = [f"# {sec['title']}\n\n"]
        if sec.get('chapters'):
            lines.append("## Contents\n\n")
            for sub in sec['chapters']:
                lines.append(f"- {sub['num']}. {sub['title']}\n")
        stub_path.write_text(''.join(lines), encoding='utf-8')
        logging.info(f"  ✓ Заглушка секции: {stub_path.name}")

    def _assemble_nested(self, book_name, config, chapters_dir, metadata):
        """
        Сборка nested-книги.

        Структура на диске (совместима с reader.html):
            chapters/
              chapter-01/               ← папка секции
                chapter-01.md           ← заглушка секции (не отображается)
                chapter-01-01.md        ← подглава 1
                chapter-01-02.md        ← подглава 2
                images/                 ← общие изображения всех подглав

        metadata.json для секции:
            {
              "file": "chapter-01.md",
              "title": "1. Section Title",
              "subchapters": [
                { "file": "chapter-01-01.md", "title": "1.1. Subchapter Title" },
                ...
              ]
            }
        """
        for sec in config['sections']:
            sec_num  = sec['num']
            sec_slug = slugify_num(sec_num)

            # Папка секции — chapter-XX/ (не section-XX/)
            ch_dir = chapters_dir / f"chapter-{sec_slug}"
            ch_dir.mkdir(exist_ok=True)

            # Заглушка chapter-XX.md
            self._make_section_stub(sec, ch_dir, sec_slug)

            # Общая папка изображений для всей секции
            images_dir = ch_dir / "images"

            # Запись секции в metadata
            sec_entry = {
                "file"       : f"chapter-{sec_slug}.md",
                "title"      : f"{sec_num}. {sec['title']}",
                "subchapters": []
            }

            for ch in sec['chapters']:
                stem     = self.chapter_file_stem(book_name, ch)
                ch_slug  = slugify_num(ch['num'])
                md_dst   = ch_dir / f"chapter-{ch_slug}.md"

                # MD-файл подглавы — прямо в папке секции
                self._copy_md(stem, md_dst)

                # Изображения — в общую images/ секции
                self._copy_images(stem, images_dir)

                sec_entry['subchapters'].append({
                    "file" : f"chapter-{ch_slug}.md",
                    "title": f"{ch['num']}. {ch['title']}"
                })

            metadata['chapters'].append(sec_entry)

    def _assemble_appendices(self, book_name, config, chapters_dir, metadata):
        """Сборка приложений."""
        for ap in config['appendices']:
            stem  = self.chapter_file_stem(book_name, ap)
            slug  = slugify_num(ap['num'])
            ap_dir= chapters_dir / f"appendix-{slug}"
            ap_dir.mkdir(exist_ok=True)
            self._copy_chapter_files(stem, ap_dir)
            metadata['appendices'].append({
                "file" : f"appendix-{slug}.md",
                "title": ap['title']
            })

    # ── Очистка ───────────────────────────────────────────────────────────────

    def cleanup_book_files(self, book_name: str, config: dict):
        """Перемещает обработанные файлы в done/<book_name>/."""
        logging.info(f"Перемещение в done: {book_name}")

        book_done = self.done_dir / book_name
        book_done.mkdir(exist_ok=True)

        # Исходный PDF и конфиг
        for fname in [config['filename'],
                      f"{Path(config['filename']).stem}-config.txt"]:
            src = self.new_dir / fname
            if src.exists():
                shutil.move(str(src), str(book_done / fname))
                logging.info(f"  → {fname}")

        # Обложка и summary
        for fname in [f"{book_name}-cover.jpg", f"{book_name}-summary.txt"]:
            src = self.books_dir / fname
            if src.exists():
                shutil.move(str(src), str(book_done / fname))
                logging.info(f"  → {fname}")

        # Папки из output
        output_done = book_done / "output"
        output_done.mkdir(exist_ok=True)

        leaves = self.get_leaf_chapters(config)
        for ch in leaves:
            stem = self.chapter_file_stem(book_name, ch)
            src  = self.output_dir / stem
            if src.exists():
                shutil.move(str(src), str(output_done / stem))

        logging.info(f"✓ Всё перемещено в done/{book_name}/")

    # ── Стадии обработки ─────────────────────────────────────────────────────

    def process_book_stage1(self, config_file: str):
        """Стадия 1 — нарезка PDF, обложка, summary."""
        try:
            config_path = self.new_dir / config_file
            config      = self.parse_config(config_path)
            book_name   = Path(config['filename']).stem
            pdf_path    = self.new_dir / config['filename']

            if not pdf_path.exists():
                logging.error(f"PDF не найден: {pdf_path}")
                return None

            logging.info(f"{'='*60}")
            logging.info(f"Стадия 1 — Подготовка: {book_name}  [{config['structure']}]")
            logging.info(f"{'='*60}")

            self.update_book_stage(book_name, "preparation")

            leaves        = self.get_leaf_chapters(config)
            created_files = self.split_pdf_by_pages(pdf_path, book_name, leaves)

            self.create_cover(pdf_path, book_name)
            self.create_summary(book_name, config)

            self.update_book_stage(book_name, "prepared", "completed")

            return {
                'book_name'     : book_name,
                'config'        : config,
                'expected_stems': [p.stem for p in created_files]
            }

        except Exception as e:
            logging.error(f"Ошибка стадии 1: {e}")
            return None

    def process_book_stage2(self, book_data: dict):
        """Стадия 2 — обработка Marker."""
        book_name = book_data['book_name']
        logging.info(f"{'='*60}")
        logging.info(f"Стадия 2 — Marker: {book_name}")
        logging.info(f"{'='*60}")
        self.update_book_stage(book_name, "marker_processing")

        t = threading.Thread(
            target=self.run_marker,
            args=(book_data['expected_stems'],)
        )
        t.start()
        t.join()

        self.update_book_stage(book_name, "marker_completed", "completed")

    def process_book_stage3(self, book_data: dict):
        """Стадия 3 — финальная сборка."""
        book_name = book_data['book_name']
        config    = book_data['config']
        logging.info(f"{'='*60}")
        logging.info(f"Стадия 3 — Сборка: {book_name}")
        logging.info(f"{'='*60}")
        self.update_book_stage(book_name, "final_assembly")

        self.assemble_final_structure(book_name, config)
        self.cleanup_book_files(book_name, config)

        self.update_book_stage(book_name, "completed", "success")
        logging.info(f"✓ Книга полностью обработана: {book_name}")

    def process_book(self, config_file: str) -> bool:
        """Полная обработка книги (все 3 стадии)."""
        book_data = self.process_book_stage1(config_file)
        if not book_data:
            return False
        self.process_book_stage2(book_data)
        self.process_book_stage3(book_data)
        return True

    # ── Восстановление ────────────────────────────────────────────────────────

    def recover_from_output(self, book_name: str) -> bool:
        """
        Восстанавливает сборку из папки output, если PDF и конфиг уже обработаны.
        Требует наличия summary-файла в done/<book_name>/.
        """
        logging.info(f"Восстановление: {book_name}")

        output_chapters = sorted(self.output_dir.glob(f"{book_name}-*"))
        if not output_chapters:
            logging.error(f"Главы не найдены в output для: {book_name}")
            return False

        summary_files = list(self.done_dir.glob(f"**/{book_name}-summary.txt"))
        if not summary_files:
            logging.error("Summary не найден. Поместите его в done/<book_name>/")
            return False

        config = self.parse_summary_file(summary_files[0])
        if not config:
            return False

        self.assemble_final_structure(book_name, config)
        self.cleanup_book_files(book_name, config)
        logging.info(f"✓ Восстановлено: {book_name}")
        return True

    def parse_summary_file(self, summary_path: Path) -> dict | None:
        """Восстанавливает конфиг из summary.txt (используется для recover)."""
        config = {
            'filename'  : '',
            'title'     : '',
            'author'    : '',
            'categories': [],
            'structure' : 'flat',
            'sections'  : [],
            'chapters'  : [],
            'appendices': [],
        }
        try:
            current_section = None
            with open(summary_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('книга:'):
                        config['filename'] = line.split(':', 1)[1].strip() + '.pdf'
                    elif line.startswith('название:'):
                        config['title'] = line.split(':', 1)[1].strip()
                    elif line.startswith('автор:'):
                        config['author'] = line.split(':', 1)[1].strip()
                    elif line.startswith('структура:'):
                        config['structure'] = line.split(':', 1)[1].strip()
                    elif line.startswith('section '):
                        parts = line.split(',', 1)
                        num   = parts[0].replace('section', '').strip()
                        title = parts[1].strip().strip('"') if len(parts) > 1 else ''
                        current_section = {'num': num, 'title': title, 'pages': '0', 'chapters': []}
                        config['sections'].append(current_section)
                    elif line.startswith('chapter '):
                        parts = line.split(',', 1)
                        num   = parts[0].replace('chapter', '').strip()
                        title = parts[1].strip().strip('"') if len(parts) > 1 else f"Chapter {num}"
                        entry = {'num': num, 'title': title, 'pages': '0'}
                        if current_section and config['structure'] == 'nested':
                            current_section['chapters'].append(entry)
                        else:
                            config['chapters'].append(entry)
                    elif line.startswith('appendix '):
                        parts = line.split(',', 1)
                        num   = parts[0].replace('appendix', '').strip()
                        title = parts[1].strip().strip('"') if len(parts) > 1 else f"Appendix {num}"
                        config['appendices'].append({'num': num, 'title': title, 'pages': '0', 'is_appendix': True})
            return config
        except Exception as e:
            logging.error(f"Ошибка парсинга summary: {e}")
            return None

    # ── Сканирование и запуск ─────────────────────────────────────────────────

    def scan_and_process(self):
        """Сканирует папку new/ и обрабатывает найденные книги."""
        logging.info("=== Сканирование new/ ===")
        configs = sorted(self.new_dir.glob("*-config.txt"))

        if not configs:
            logging.info("Новых книг не найдено.")
            return

        logging.info(f"Найдено: {len(configs)} книг")
        for config_file in configs:
            self.process_book(config_file.name)

    def run_scheduler(self):
        """Режим планировщика — проверка каждые 4 часа."""
        logging.info("Комбайн Ф. Скорины — режим планировщика (каждые 4 ч)")
        schedule.every(4).hours.do(self.scan_and_process)
        self.scan_and_process()  # первый запуск сразу
        while True:
            schedule.run_pending()
            time.sleep(60)


# ─────────────────────────────────────────────────────────────────────────────
# Точка входа
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    combiner = SkorynaCombiner()

    if len(sys.argv) > 1:
        cmd = sys.argv[1]

        if cmd == "--schedule":
            combiner.run_scheduler()

        elif cmd == "--recover":
            if len(sys.argv) < 3:
                print("Использование: python skoryna_combiner.py --recover <название_книги>")
            else:
                combiner.recover_from_output(sys.argv[2])

        elif cmd == "--stage1":
            if len(sys.argv) < 3:
                print("Использование: python skoryna_combiner.py --stage1 <config-file.txt>")
            else:
                combiner.process_book_stage1(sys.argv[2])

        elif cmd == "--stage3":
            if len(sys.argv) < 3:
                print("Использование: python skoryna_combiner.py --stage3 <config-file.txt>")
            else:
                config = combiner.parse_config(combiner.new_dir / sys.argv[2])
                book_name = Path(config['filename']).stem
                book_data = {'book_name': book_name, 'config': config}
                combiner.process_book_stage3(book_data)

        else:
            print("Неизвестная команда.")
            print("Доступные режимы:")
            print("  python skoryna_combiner.py                        # Разовый запуск")
            print("  python skoryna_combiner.py --schedule             # Планировщик")
            print("  python skoryna_combiner.py --recover <книга>      # Восстановление из output")
            print("  python skoryna_combiner.py --stage1 <config.txt>  # Только нарезка PDF")
            print("  python skoryna_combiner.py --stage3 <config.txt>  # Только финальная сборка")
    else:
        combiner.scan_and_process()
