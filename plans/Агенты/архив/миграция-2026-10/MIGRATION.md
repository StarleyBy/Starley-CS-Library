# Применение пакета (Волна 0 + агенты Волны 1: «Валидатор глав», квиз и таксономия)

Пакет содержит файлы в тех же путях, что и в репозитории. Ничего не удаляется: старые инструкции переносятся в архив через `git mv` (история сохраняется).

## Что внутри
| Файл | Действие |
|---|---|
| `AGENTS.md` | новый |
| `.agents/REGISTRY.md` | новый |
| `.agents/skills/editor/SKILL.md` (v1.2), `guideliner/SKILL.md`, `coder/SKILL.md` (v1.1) | заменяют текущие |
| `.agents/skills/chapter-validator/SKILL.md` | новый агент «Валидатор глав» |
| `.agents/skills/quiz-master/SKILL.md` + `references/html-formatting.md` | новый агент «Квиз-Мастер» |
| `.agents/skills/quiz-verifier/SKILL.md` | новый агент «Квиз-Верификатор» |
| `.agents/skills/taxonomist/SKILL.md` | новый агент «Таксономист» |
| `tools/validate-quiz.mjs`, `tools/quiz-baseline.json` | проверка манифестов квиза, реестров и таксономии; базовая линия |
| `plans/Агенты/Аудит_квиза_2026-10-23.md` | состояние квиза и таксономии |
| `.agents/skills/cache-keeper/SKILL.md` | новый агент «Хранитель кэша и PWA» |
| `.agents/skills/quiz-ux/SKILL.md` | новый агент «UX квиза» |
| `tools/map-functions.mjs` | карта функций больших JS-файлов (без зависимостей) |
| `tools/check-quiz-i18n.mjs`, `tools/quiz-i18n-baseline.json` | проверка локализации квиза; базовая линия |
| `plans/Агенты/Аудит_квиза_UX_2026-10-24.md` | состояние интерфейса и локализации квиза |
| `.agents/skills/repo-keeper/SKILL.md` | новый агент «Хранитель репозитория» |
| `tools/preflight.mjs` | все проверки перед коммитом одной командой |
| `tools/check-repo-health.mjs` | гигиена репозитория и секреты (необязательный `tools/repo-health-allow.json` для известных исключений) |
| `plans/Агенты/Аудит_репозитория_2026-10-25.md` | состояние репозитория |
| `.agents/skills/catalogist/SKILL.md` | новый агент «Каталогизатор» |
| `tools/validate-library.mjs`, `tools/library-baseline.json` | согласованность каталога книг и глав; базовая линия |
| `tools/repo-health-allow.json` | осознанно принятые находки гигиены репозитория (секрет в `quiz.js` по вашему решению от 26.10.2026) |
| `plans/Агенты/Аудит_каталога_2026-10-26.md` | состояние каталога |
| `.agents/skills/supabase-engineer/SKILL.md` | новый агент «Supabase-инженер» |
| `tools/check-supabase-sql.mjs`, `tools/check-sql-syntax.py` | статический линтер SQL и Edge Functions; проверка синтаксиса PL/pgSQL (нужен `pip install pglast`) |
| `quiz/verify-live-db.sql` | запросы только для чтения для проверки живой базы |
| `quiz/proposed/hardening-2026-10.sql` | предложение по укреплению доступа (не применено) |
| `plans/Агенты/Аудит_Supabase_2026-10-26.md` | аудит серверной части |
| `tools/migrate-taxonomy-ids.mjs` | миграция устаревших id таксономии в манифестах квиза (по умолчанию пробный запуск) |
| `quiz/proposed/legacy-taxonomy-map.json` | карта соответствий с подсказками для решения человеком |
| `.agents/skills/deploy-ci/SKILL.md` | новый агент «Деплой и CI» |
| `tools/check-sw-shell.mjs` | проверка Service Worker, оболочки, манифеста, необходимости подъёма версии кэша (без базовой линии: правок в `sw.js` скрипт не делает, кроме `--bump`) |
| `plans/Агенты/Аудит_PWA_2026-10-24.md` | состояние PWA |
| `tools/validate-chapters.mjs` | новый проверочный скрипт (без зависимостей) |
| `tools/chapters-baseline.json` | новый: известные дефекты старых глав (≈150 КБ) |
| `plans/Агенты/Аудит_глав_2026-10-23.md` | новый: состояние глав по книгам |
| `tests/sandbox/.gitignore` | новый (папка песочницы, содержимое не коммитится) |
| `plans/Агенты/README.md`, `plans/Агенты/План_агентов.md` | новые |
| `MIGRATION.md` | этот файл, в репозиторий не нужен |

## Шаги (PowerShell, из корня репозитория)

1. Распаковать пакет поверх репозитория (с заменой трёх `SKILL.md`).
2. Перенести старые копии инструкций в архив:

```powershell
New-Item -ItemType Directory -Force "plans\Агенты\архив\гайдлайны-стартер" | Out-Null
git mv "plans\Редактор\Редактор_Инструкция.md"            "plans\Агенты\архив\Редактор_Инструкция.md"
git mv "plans\Кодер\Кодер_Инструкция.md"                  "plans\Агенты\архив\Кодер_Инструкция.md"
git mv "plans\Гайдлайны\Гайдлайнер_Инструкция.md"         "plans\Агенты\архив\Гайдлайнер_Инструкция.md"
git mv "plans\Гайдлайны\Гайдлайны, инструкция.txt"        "plans\Агенты\архив\Гайдлайны, инструкция.txt"
git mv "plans\Гайдлайны\guideline-table.schema.json"      "plans\Агенты\архив\гайдлайны-стартер\"
git mv "plans\Гайдлайны\guideline-tables.css"             "plans\Агенты\архив\гайдлайны-стартер\"
git mv "plans\Гайдлайны\rt04-reperfusion-and-invasive-strategy.json" "plans\Агенты\архив\гайдлайны-стартер\"
git mv "plans\Гайдлайны\starter_unpacked"                 "plans\Агенты\архив\гайдлайны-стартер\starter_unpacked"
```

Файлы в `гайдлайны-стартер` — исторический стартовый набор. Он **отличается** от живых версий (`schema/`, `assets/css/`, `data/guidelines/`), так что использовать его как образец нельзя. Валидатор из стартового набора идентичен текущему `tools/validate-tables.mjs`.

3. Проверить:

```powershell
node tests/run-all.mjs                           # ожидается: 0 проваленных
node tools/validate-tables.mjs                   # ожидается: 0 error(s)
node tools/validate-chapters.mjs --baseline      # ожидается: 0 ошибок (известные дефекты скрыты)
node tools/validate-quiz.mjs --baseline          # ожидается: 0 ошибок (известные дефекты скрыты)
node tools/check-quiz-i18n.mjs --baseline        # ожидается: 0 ошибок, 0 предупреждений (известные отклонения скрыты)
node tools/validate-library.mjs --baseline       # ожидается: 0 ошибок, 0 предупреждений (известные скрыты)
node tools/check-supabase-sql.mjs                # ожидается пока 3 ошибки (см. аудит Supabase); после исправлений 0
node tools/preflight.mjs                         # все проверки сразу; пока токен Telegram в quiz.js не убран, проверка «репозиторий» будет FAIL (G005)
node tools/check-sw-shell.mjs                    # ожидается: 0 ошибок (12 предупреждений S010/S011 исчезнут после `--add`, см. ниже)
git status
```

4. Коммит (по вашему решению; pre-commit хук синхронизирует R2, нужна сеть и `.env`):

```powershell
git add AGENTS.md .agents tests/sandbox plans tools/validate-chapters.mjs tools/chapters-baseline.json tools/validate-quiz.mjs tools/quiz-baseline.json tools/check-sw-shell.mjs tools/map-functions.mjs tools/check-quiz-i18n.mjs tools/quiz-i18n-baseline.json tools/preflight.mjs tools/check-repo-health.mjs tools/repo-health-allow.json tools/validate-library.mjs tools/library-baseline.json tools/check-supabase-sql.mjs tools/check-sql-syntax.py tools/migrate-taxonomy-ids.mjs quiz/verify-live-db.sql quiz/proposed
git commit -m "agents: AGENTS.md, реестр, единый источник правды, валидаторы глав и квиза, агенты квиза и таксономии"
```

## Что остаётся на вашем решении
- `Master_prompt.md` в корне **не тронут**: в `AGENTS.md` он назван производной копией для внешних чатов. Если вы им пользуетесь вне репозитория (например, в проекте веб-ассистента) — оставьте. Если нет — перенесите в `plans/Агенты/архив/`.
- `plans/Автоквиз/Создание манифестов квиза.txt` не тронут: станет основой навыка «Квиз-Мастер» (Волна 1).
- **Antigravity.** По документации и руководствам Antigravity читает `AGENTS.md` из корня проекта и навыки из `.agents/skills/<имя>/SKILL.md`, так что текущая раскладка подходит без дополнительных файлов. `GEMINI.md` нужен только для правил, специфичных для Antigravity (при конфликте он главнее `AGENTS.md`). Глобальные навыки лежат в `~/.gemini/antigravity/skills/`. Это сведения из сторонних источников: если навыки не подхватились, проверьте пути в актуальной документации Antigravity и перезапустите агента.

## Как пользоваться валидатором глав

```powershell
node tools/validate-chapters.mjs "books\cardiac-surgery\Kirklin5\chapters\chapter-05"   # строго: новая или правленая глава
node tools/validate-chapters.mjs --changed                                               # строго: всё, что изменено по git
node tools/validate-chapters.mjs --baseline                                              # по всему каталогу: только новые дефекты
node tools/validate-chapters.mjs --json > audit.json                                     # полный аудит
```

Старые главы содержат много дефектов (в том числе 67 файлов с дисбалансом `<details>`): они зафиксированы в `chapters-baseline.json` и не мешают работе, но не расширяйте базовую линию, чтобы скрыть новые проблемы. Подробности — `.agents/skills/chapter-validator/SKILL.md`, раздел 5.

Необязательный следующий шаг: подключить `node tools/validate-chapters.mjs --baseline` в `tests/run-all.mjs` и в workflow деплоя — тогда проверка станет автоматической (это задача «Кодера» и «Деплой и CI»; я её не делал, чтобы не менять ваши тесты без просьбы).

## Как пользоваться проверкой квиза

```powershell
node tools/validate-quiz.mjs "books\work\examen\quiz\quiz-adult.json"   # строго: конкретный манифест (+ реестры)
node tools/validate-quiz.mjs --changed                                    # строго: изменённые по git манифесты
node tools/validate-quiz.mjs --baseline                                   # по всему квизу: только новые дефекты
node tools/validate-quiz.mjs --json > quiz-audit.json                     # полный аудит
```

Скрипт проверяет формат вопросов, правильный ответ, согласованность пояснения с ответом (Q013), сноски `[n]`, баланс HTML, ссылки на таксономию, реестры (`allquiz.json`, `metadata.json`, запасной список в `quiz.js`) и, если папка `books/work/examen/quiz/images` есть у вас локально, наличие картинок. Известные дефекты (в первую очередь устаревшие id таксономии) записаны в `tools/quiz-baseline.json`. Состояние на 23.10.2026 — `plans/Агенты/Аудит_квиза_2026-10-23.md`.

## Очистка следов Qwen (по вашему решению)

```powershell
git rm -r .qwen
```

В `.github/workflows/jekyll-gh-pages.yml` (шаг «Clean dev-only files before upload», строка 44) стоит `rm -rf node_modules .qwen plans combain`. После удаления папки уберите из строки `.qwen` (`rm -rf node_modules plans combain`); оставленный токен безвреден, это только порядок.

Что стоит знать при этом:
- Прежний `.qwen/settings.json` разрешал агенту выполнять `git add/commit/checkout/pull/tag` без вопросов. В Antigravity это определяется политикой выполнения терминальных команд самой IDE (проверьте её в настройках, если такая опция есть в вашей версии). Правила `AGENTS.md` запрещают коммит и деструктивный git без вашей просьбы, но подтверждение на уровне IDE надёжнее.
- Шаг очистки в workflow удаляет перед публикацией только `node_modules`, `.qwen`, `plans`, `combain`. Всё остальное, в том числе `AGENTS.md`, `.agents/`, `tools/`, `tests/`, `scratch/`, `Master_prompt.md`, может оказаться на сайте GitHub Pages. Если это нежелательно, расширьте строку очистки, предварительно убедившись, что приложение не обращается к этим путям (особенно `tools/` и `tests/`).

## Рисунки (как это учитывают валидаторы)

- Рисунки главы: `books/<категория>/<книга>/chapters/chapter-XX/images/`; в markdown указывается только имя файла. Рисунки квиза: `<папка книги>/quiz/images/`; в манифесте — только имя файла.
- Папки создаются при работе, перенос в облако R2 автоматический; в git рисунки не попадают. Валидаторы выдают **предупреждение I001**, если файл из разметки не найден в локальной папке `images/`. Если папки локально нет (например, вы очистили её после загрузки), проверка просто молчит.

## Как пользоваться проверкой кэша

```powershell
node tools/check-sw-shell.mjs                       # после правок файлов оболочки (сравнение с HEAD)
node tools/check-sw-shell.mjs --since=origin/main   # перед релизом: относительно опубликованного состояния
node tools/check-sw-shell.mjs --bump                # поднять static-vNN и dynamic-vNN (на релиз, не на каждую правку)
```

Подъём версии очищает кэш `dynamic` у всех пользователей (в том числе поисковый индекс ≈ 81 МБ скачивается заново), поэтому его делают на релиз. CSS из оболочки без подъёма версии у пользователей не обновится. Подробности и 12 известных предупреждений (основной стиль `style.css` и ряд скриптов не входят в оболочку) — `plans/Агенты/Аудит_PWA_2026-10-24.md`.

### Недостающие файлы в оболочку (ваше решение: добавить сейчас, версию позже)

Команда вносит 12 файлов в `APP_SHELL` (формат и переводы строк `sw.js` сохраняются, версия не меняется):

```powershell
node tools/check-sw-shell.mjs --add assets/css/style.css assets/css/auth.css assets/css/media-inspector.css assets/js/config.js assets/js/auth.js assets/js/app.js assets/js/media-inspector.js assets/js/quiz-i18n.js assets/js/settings.js assets/js/radial-menu.js assets/js/tab-manager.js assets/js/navigation.js
node tools/check-sw-shell.mjs      # ожидается: 0 ошибок, 0 предупреждений, одно сведение S023
```

Тот же результат даёт патч `sw-shell-add.patch` (`git apply sw-shell-add.patch`), но команда надёжнее: патч привязан к построчному виду вашего текущего `sw.js` и к переводам строк CRLF. После публикации браузеры переустановят Service Worker и скачают оболочку заново (≈ 190 КБ добавки); кэш `dynamic` сохранится. Версию поднимете на релиз командой `node tools/check-sw-shell.mjs --bump`.

## Карта функций и локализация квиза

```powershell
node tools/map-functions.mjs assets/js/quiz.js                  # карта функций и разделов (340 функций)
node tools/map-functions.mjs assets/js/quiz.js --find=timer     # функции по имени
node tools/map-functions.mjs assets/js/quiz.js --at=4210        # какая функция содержит строку 4210
node tools/check-quiz-i18n.mjs                                  # полная картина по локализации квиза
node tools/check-quiz-i18n.mjs --baseline                       # только новые отклонения
```

Исправление в уже выданных проверочных скриптах: при выводе JSON в конвейер (`... --json | python ...`) результат мог обрезаться. Все скрипты в этом пакете переведены на корректное завершение (`process.exitCode`), поэтому обновите их целиком (zip содержит свежие версии). Состояние интерфейса квиза — `plans/Агенты/Аудит_квиза_UX_2026-10-24.md`.

## Все проверки перед коммитом

```powershell
node tools/preflight.mjs                   # сводка по всем проверкам, код возврата 1 при провале
node tools/preflight.mjs --verbose         # полный вывод проваленных
node tools/preflight.mjs --only=chapters,quiz
node tools/check-repo-health.mjs --history # гигиена репозитория + самые тяжёлые версии файлов в истории
```

**Срочно:** в `assets/js/quiz.js` (строка 2474) лежит токен Telegram-бота, а репозиторий и сайт публичные. Его нужно отозвать (`/revoke` в @BotFather) и убрать из кода; подробности и порядок действий — `plans/Агенты/Аудит_репозитория_2026-10-25.md`, раздел 1. До этого `preflight` будет показывать провал проверки «Гигиена репозитория и секреты» (G005); это намеренно и исчезнет после исправления. Временно пропустить проверку можно ключом `--skip=repo`, но токен от этого безопаснее не станет.

## Применение патча `repo-cleanup.patch` (убрать лишнее, очистка сайта, индекс при публикации)

Патч лежит отдельно от zip (он правит рабочие файлы `.github/workflows/jekyll-gh-pages.yml`, `.gitignore`, `package.json`, `tests/run-all.mjs`). Содержимое:

- удаляет `.qwen/settings.json`, `.qwen/settings.json.orig`, `assets/css/reader.css.backup`;
- в workflow: убирает лишний `lfs: true`; добавляет шаг сборки поискового индекса (`node search/generate-search-index.js`, около 17 секунд) **перед** очисткой; расширяет очистку (`scratch`, `tools`, `tests`, `scripts`, `supabase`, `.agents`, `AGENTS.md`, `Master_prompt.md`, `SEARCH_GUIDE.md`, `package.json`, `package-lock.json`, `.env.example` помимо прежних `node_modules`, `plans`, `combain`);
- в `.gitignore`: `search/search-index.json` и `scratch/*.pdf`;
- в `package.json`: команда `npm run build:search`;
- в `tests/run-all.mjs`: отсутствие локального `search-index.json` больше не считается провалом (индекс собирается при публикации).

```powershell
git apply --check repo-cleanup.patch        # при ошибках про пробелы: добавьте --ignore-whitespace
git apply repo-cleanup.patch
git rm --cached search/search-index.json    # перестать хранить индекс в git (локальный файл останется)
git rm --cached "scratch/*.pdf"            # убрать PDF-файлы scratch из git (сейчас их 6, около 45 МиБ; локальные копии останутся, удалите вручную, если не нужны)
git status
```

Как проверено: сайт собран по шагам workflow на копии (индекс сгенерирован с нуля, затем выполнена очистка): все 40 файлов оболочки и все локальные скрипты и стили страниц на месте; `run-all` проходит без индекса (12 из 12).

Что изменится для вас:
- локальный `search/search-index.json` остаётся на диске, но больше не попадает в git; после изменения контента его, как и раньше, пересобирают (`npm run build:search`); на новой машине его нужно собрать этой командой, иначе локальный поиск не заработает;
- история перестанет раздуваться тяжёлыми версиями индекса (сейчас они составляют основную часть `.git`).

Замечание вне патча: `editor.html` подключает `combain/combiner-launcher.js`, а папку `combain` workflow удаляет перед публикацией. Для опубликованного сайта это уже сейчас запрос к несуществующему файлу (в редакторе, который, вероятно, используется только локально); патч этого не меняет.

## Каталог книг и глав

```powershell
node tools/validate-library.mjs                 # все книги
node tools/validate-library.mjs icu/marino      # одна книга
node tools/validate-library.mjs --baseline      # только новые находки
```

Найдено в каталоге (подробности в `plans/Агенты/Аудит_каталога_2026-10-26.md`): в Marino запись главы 31 с опечаткой `chapter-31md` (глава не откроется по записи), а файл главы 50 называется `chapter-.md`; у части книг флаги `versions` не соответствуют файлам (влияет только на бейджи EN/RU/HE); у `mysummary` записи глав 7–14 без файлов.

## Supabase: что сделать вам (по порядку)

Подробности — `plans/Агенты/Аудит_Supabase_2026-10-26.md`. Я не имею доступа к вашей базе, поэтому нужны ваши руки.

1. Откройте Supabase Dashboard → SQL Editor → выполните запросы из `quiz/verify-live-db.sql` (только чтение) и пришлите результаты пунктов 1–7 (в них нет ключей и паролей).
2. Dashboard → Authentication → Providers → Email: включено ли «Allow new users to sign up»; Sign In / Providers: включён ли «Allow anonymous sign-ins». Если пользователей создаёте только вы, регистрацию лучше выключить (клиент сам перейдёт на Edge Function).
3. Если запрос 1 покажет политику обновления профиля без `with_check`, примените раздел 1 из `quiz/proposed/hardening-2026-10.sql` (триггер, не дающий менять `role`) на копии проекта или после резервной копии. У каждого раздела в файле есть откат.
4. После применения: повторите `verify-live-db.sql`, затем `git mv quiz/proposed/hardening-2026-10.sql quiz/applied/`.

Служебная папка Supabase CLI: `supabase/.temp` отслеживается git. Уберите её:

```powershell
Add-Content .gitignore "`nsupabase/.temp/"
git rm -r --cached supabase/.temp
```

Предупреждение при `preflight`: проверка `supabase` «мягкая» (показывается как WARN и не блокирует коммит), пока вы не приняли решение по аудиту. Осознанно принятый риск фиксируется файлом `tools/supabase-sql-allow.json` (запись с `acknowledged: true` и причиной).

## Миграция таксономии квиза (по вашему решению)

Подробности — навык «Таксономист», раздел 2.2, и `plans/Агенты/Аудит_квиза_2026-10-23.md`, раздел 6.

```powershell
node tools/migrate-taxonomy-ids.mjs                  # пробный запуск: сводка, файлы не меняются
node tools/migrate-taxonomy-ids.mjs --write-map      # обновить карту с подсказками
```

- 696 вхождений решаются автоматически (перенос корректного id в нужное поле и замена названия на id).
- 1 297 вхождений (720 различных значений) требуют вашего решения: откройте `quiz/proposed/legacy-taxonomy-map.json`, у значений в разделе `unresolved` заполните `target` (например, `{"field":"tags","id":"ecmo"}`) или `"drop"`. Агент может предложить заполнение по подсказкам, но применять без вашего согласия не будет.
- Применение: закоммитьте или сделайте копию, затем `node tools/migrate-taxonomy-ids.mjs --map=quiz/proposed/legacy-taxonomy-map.json --apply`. Скрипт правит только три массива, делает самопроверку перед записью и ничего не пишет при расхождении.
- После применения: `node tools/validate-quiz.mjs`, `node scripts/generate-taxonomy-bridge.js`, пересборка поискового индекса (`npm run build:search`), `node tools/check-sw-shell.mjs`.

## Проверки перед публикацией: патч `ci-preflight.patch`

Патч добавляет в workflow один шаг `node tools/preflight.mjs` (после `npm ci`, до синхронизации R2, сборки индекса и очистки). Применять **после** `repo-cleanup.patch` (он правит тот же файл):

```powershell
git apply --check --ignore-whitespace ci-preflight.patch
git apply --ignore-whitespace ci-preflight.patch
```

Как проверено: свежий клон (как в Actions) с применённым `repo-cleanup.patch`: `npm ci`, затем `preflight` проходит за ≈ 15 секунд (12 из 12 автотестов, таблицы, главы, каталог, квиз, локализация, кэш; проверка Supabase даёт WARN и не блокирует; репозиторий: 0 ошибок). Патч ложится поверх `repo-cleanup.patch` без конфликтов.

Что изменится: если любая «жёсткая» проверка упадёт, сайт не опубликуется, а в Actions будет сводка (какая проверка, сколько находок). Если хотите видеть результат, но не блокировать публикацию, добавьте шагу `continue-on-error: true`. Разбор упавших сборок — навык «Деплой и CI», раздел 3.

Порядок применения всего набора патчей и команд: 1) распаковать пакет, 2) `repo-cleanup.patch` + две команды `git rm --cached`, 3) `ci-preflight.patch`, 4) `sw-shell-add.patch` (или команда `--add`), 5) `node tools/preflight.mjs`, 6) коммит.
