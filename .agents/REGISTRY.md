# Реестр агентов Starley CS Library

Общие правила и команды — `/AGENTS.md`. Источник правды по работе каждого агента — его `SKILL.md`.
План развития системы агентов — `plans/Агенты/План_агентов.md`.

## Действующие агенты

| ID | Агент | scope | Версия | Файл | Зона ответственности | Опирается на |
|---|---|---|---|---|---|---|
| L00 | Адъютант | local | 1.0 | `.agents/skills/adjutant/SKILL.md` | Персональный секретарь: оркестрация, декомпозиция задач, делегирование агентам, сводный отчёт | Все агенты и инструменты |
| L01 | Редактор | local | 1.2 | `.agents/skills/editor/SKILL.md` | Главы и статьи (EN/RU), медиа глав, `metadata.json`, `library.json` | `search/generate-search-index.js` |
| L05 | Валидатор глав | local | 1.0 | `.agents/skills/chapter-validator/SKILL.md` | Независимая приёмка глав: структура, якоря, паритет EN/RU, сверка чисел, регистрация | `tools/validate-chapters.mjs`, `tools/chapters-baseline.json` |
| L06 | Каталогизатор | local | 1.0 | `.agents/skills/catalogist/SKILL.md` | Каталог: `library.json`, `metadata.json` книг, записи глав, флаги `versions`, каркас новой книги | `tools/validate-library.mjs`, `tools/library-baseline.json` |
| L13 | Гайдлайнер | local | 1.1 | `.agents/skills/guideliner/SKILL.md` | Таблицы гайдлайнов в `data/guidelines/` | `schema/`, `tools/validate-tables.mjs`, `tools/build-tables-index.mjs` |
| L17 | Квиз-Мастер | local | 1.0 | `.agents/skills/quiz-master/SKILL.md` | Манифесты квиза из сборников: вопросы EN/RU, пояснения, таксономия (из существующих id), картинки, раскладка по тематическим квизам, реестры | `tools/validate-quiz.mjs`, `quiz/quiz-taxonomy.json` |
| L18 | Квиз-Верификатор | local | 1.0 | `.agents/skills/quiz-verifier/SKILL.md` | Независимая приёмка вопросов: ключ по источникам, пояснение↔ответ, EN↔RU, реестры | `tools/validate-quiz.mjs`, `tools/quiz-baseline.json` |
| L19 | Таксономист | local | 1.1 | `.agents/skills/taxonomist/SKILL.md` | Словарь таксономии, миграция id в манифестах, карта глав по темам, счётчики | `quiz/quiz-taxonomy.json`, `tools/migrate-taxonomy-ids.mjs`, `scripts/generate-taxonomy-bridge.js`, `scripts/build-book-taxonomy-map.js` |
| L08 | Схематист | local | 1.0 | `.agents/skills/schematist/SKILL.md` | Клинические алгоритмы, схемы, деревья решений в SVG/HTML/Mermaid, атлас `books/summary/algorithms/`, внедрение в главы и квизы | `search/generate-search-index.js`, `tools/validate-chapters.mjs` |
| L31 | Хранитель кэша и PWA | local | 1.0 | `.agents/skills/cache-keeper/SKILL.md` | Версии кэшей и `APP_SHELL` в `sw.js`, `manifest.json`, `offline.html`; решение, когда поднимать версию | `tools/check-sw-shell.mjs` |
| L26 | UX квиза | local | 1.0 | `.agents/skills/quiz-ux/SKILL.md` | Интерфейс квиза: лобби, сессия, таймер, результаты, мобильная вёрстка, локализация RU/EN без смешения языков | `tools/map-functions.mjs`, `tools/check-quiz-i18n.mjs`, `tools/quiz-i18n-baseline.json` |
| L32 | Хранитель репозитория | local | 1.0 | `.agents/skills/repo-keeper/SKILL.md` | Безопасные коммиты (preflight), R2 и pre-commit хук, размер файлов и истории, секреты, остатки LFS, публикация | `tools/preflight.mjs`, `tools/check-repo-health.mjs` |
| L33 | Supabase-инженер | local | 1.0 | `.agents/skills/supabase-engineer/SKILL.md` | Схема, политики доступа (RLS), функции базы, Edge Function `admin-create-user`, вход по PIN; исправления как предложения | `tools/check-supabase-sql.mjs`, `tools/check-sql-syntax.py`, `quiz/verify-live-db.sql` |
| L34 | Деплой и CI | local | 1.0 | `.agents/skills/deploy-ci/SKILL.md` | Workflow публикации GitHub Pages: порядок шагов, проверки перед публикацией (preflight), индекс, R2, очистка, разбор упавшей сборки | `.github/workflows/*`, `tools/preflight.mjs` |
| L24 | Кодер | local | 1.1 | `.agents/skills/coder/SKILL.md` | Код приложения, поиск, Service Worker, тесты | `tests/run-all.mjs`, `tests/unit/` |
| L35 | Интеракционист | local | 1.0 | `.agents/skills/interactive-engineer/SKILL.md` | Разработка и интеграция интерактивных схем, симуляторов, врезка HTML в главы и квизы, реестр интерактивных схем | `data/interactive/interactive-index.json`, `tools/list-interactive.mjs`, `sw.js` |

ID соответствуют каталогу из плана агентов (L — локальные, G — глобальные).

## Правила ведения реестра

1. Новый агент: создать `.agents/skills/<имя>/SKILL.md` по шаблону из плана, добавить строку в таблицу выше и в раздел 6 `AGENTS.md`.
2. Изменил правила агента — поднять версию в шапке его `SKILL.md` и в этой таблице; в конце файла реестра добавить строку в журнал.
3. Правило живёт только в одном месте: в `SKILL.md` агента или в `AGENTS.md`. Копии в `plans/` и других папках не создавать.
4. Границы агентов (что он НЕ делает) должны быть описаны в его `SKILL.md`, раздел 0, и не противоречить таблице выше.

## Журнал изменений

| Дата | Что изменено |
|---|---|
| 2026-11-06 | Добавлен агент «Интеракционист» (L35, v1.0, `.agents/skills/interactive-engineer/SKILL.md`) — разработка автономных интерактивных схем (HTML5/SVG/Vanilla JS), симуляторов и атласов (`assets/interactive/`), ведение реестра `data/interactive/interactive-index.json`, внедрение во фреймах в главы (`#### 🎛️ ...`) и квизы. Создан инструмент `tools/list-interactive.mjs` (--validate вшит в `preflight.mjs`) |
| 2026-11-04 | Добавлен агент «Схематист» (L08, v1.0, `.agents/skills/schematist/SKILL.md`) — синтез клинических схем, деревьев решений, алгоритмов и ведение книги-атласа `books/summary/algorithms/`. Создан атлас алгоритмов, сгенерирована обложка `cover.jpg` |
| 2026-11-03 | Добавлен агент «Адъютант» (L00, v1.0, `.agents/skills/adjutant/SKILL.md`) — персональный секретарь и координатор задач. Введён единый стандарт обязательных бейджей ролей в ответах чата. Поддержаны шорткоды быстрого переключения агентов (`/adjutant`, `/editor`, `/coder`, `/preflight` и др.). В живой базе Supabase применён триггер защиты ролей, регистрация закрыта (OFF) |
| 2026-10-26 | Проверка глав откалибрована по новому содержимому (EACVI Echo Handbook, новые главы guide): допустимы `open` в `<details>` и рисунки `<figure id="fig-…">`; базовая линия глав обновлена; новые находки описаны в дополнении к аудиту глав |
| 2026-10-26 | Добавлен агент «Деплой и CI» (L34, v1.0) и патч `ci-preflight.patch` (шаг `node tools/preflight.mjs` в workflow перед публикацией; проверен на свежем клоне: ≈ 15 секунд, все жёсткие проверки проходят) |
| 2026-10-26 | Таксономист → 1.1: добавлен инструмент `tools/migrate-taxonomy-ids.mjs` (миграция устаревших id таксономии в манифестах квиза: пробный запуск, карта с подсказками, применение с самопроверкой) и карта `quiz/proposed/legacy-taxonomy-map.json` |
| 2026-10-26 | Добавлен агент «Supabase-инженер» (L33, v1.0), инструменты `tools/check-supabase-sql.mjs`, `tools/check-sql-syntax.py`, запросы `quiz/verify-live-db.sql`, предложение `quiz/proposed/hardening-2026-10.sql`; в `tools/preflight.mjs` добавлена «мягкая» проверка `supabase` (WARN). Найдена возможность самовыдачи роли администратора по файлам политик (нужна проверка живой базы). Язык интерфейса квиза по умолчанию: по плану владельца английский (поправлены навык и аудит UX) |
| 2026-10-26 | Добавлен агент «Каталогизатор» (L06, v1.0), инструмент `tools/validate-library.mjs` с базовой линией и шаг `library` в `tools/preflight.mjs`. Редактор и Валидатор глав проверяют регистрацию главы этим инструментом. По решениям владельца: секрет в `quiz.js` принят как известный риск (`tools/repo-health-allow.json`, отзыв позже), подготовлен патч `repo-cleanup.patch` (удаление лишнего, расширенная очистка workflow, поисковый индекс собирается при публикации) |
| 2026-10-25 | Добавлен агент «Хранитель репозитория» (L32, v1.0), инструменты `tools/preflight.mjs` (все проверки одной командой) и `tools/check-repo-health.mjs` (гигиена репозитория, секреты). Найден токен Telegram-бота в `quiz.js` (см. аудит репозитория) |
| 2026-10-24 | Добавлен агент «UX квиза» (L26, v1.0), инструменты `tools/map-functions.mjs` (карта функций больших JS-файлов) и `tools/check-quiz-i18n.mjs` (локализация квиза, базовая линия `tools/quiz-i18n-baseline.json`). Во всех проверочных скриптах вывод JSON через конвейер больше не обрезается (`process.exitCode` вместо `process.exit`). Кодер использует карту функций для больших файлов |
| 2026-10-24 | По решению владельца: недостающие стили и скрипты (12 файлов) вносятся в `APP_SHELL` командой `--add`, подъём версии кэша отложен до релиза. `check-sw-shell` уточнён: клиенты обновляют оболочку при любом изменении `sw.js`; добавлены `--add`, S023 (сведение), S024 |
| 2026-10-24 | Добавлен агент «Хранитель кэша и PWA» (L31, v1.0) и инструмент `tools/check-sw-shell.mjs` (проверка оболочки, версий, манифеста, необходимости подъёма версии, `--bump`). Кодер, Гайдлайнер, Таксономист передают ему файлы оболочки |
| 2026-10-24 | По ответам владельца: рисунки глав — `chapters/chapter-XX/images/`, квизов — `<книга>/quiz/images/` (автоперенос в R2); `allquiz.json` ведётся вручную (ответственность Квиз-Мастера); проверка I001 (предупреждение) в обоих валидаторах; цвета пояснений закреплены значениями по умолчанию; Qwen удалён из рабочего окружения |
| 2026-10-23 | Добавлены агенты «Квиз-Мастер» (L17), «Квиз-Верификатор» (L18), «Таксономист» (L19), инструмент `tools/validate-quiz.mjs` и базовая линия `tools/quiz-baseline.json`. В AGENTS.md: раздел «Окружение», команды и цепочки квиза, уточнено правило про эмодзи |
| 2026-10-23 | Добавлен агент «Валидатор глав» (L05, v1.0) и инструмент `tools/validate-chapters.mjs` с базовой линией. Редактор → 1.2: самопроверка скриптом и передача на приёмку Валидатору |
| 2026-10-23 | Создан `AGENTS.md` и реестр. Три навыка обновлены до 1.1: добавлены границы, условия остановки, формат передачи работы; перенесены уникальные правила из `plans/*Инструкция.md` и `Master_prompt.md`; в Гайдлайнер добавлены EACTS, `neutral` в `tone`, правила распознавания изображений; Кодер переведён на нейтральные формулировки инструментов |
