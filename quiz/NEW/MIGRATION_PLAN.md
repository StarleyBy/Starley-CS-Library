# Миграция квиза на Supabase — план внедрения

## Что чинит каждая часть (сопоставление с аудитом)

| Проблема из аудита | Как решено в новой схеме |
|---|---|
| Весь профиль в одной JSON-ячейке → лимит 50 000 символов | `favorites` / `playlist_items` / `quiz_sessions` — отдельные строки таблиц. Ячеек с большим JSON больше нет в принципе. |
| Полный билингвальный текст вопроса дублируется в каждой сессии | `quiz_sessions.detail_summary` хранит только компактную строку (`12🧠45(A)B`) — тот же формат, что уже считает мёртвая функция `sanitizeSessionForSync()`, просто теперь реально используется. Текст вопроса и так есть в статических manifest-файлах. |
| `pullFromSheets` = `action=getAll`, тянет данные всех пользователей всем клиентам | RLS: `select`/`insert`/`update`/`delete` физически ограничены `user_id = auth.uid()`. Чужие данные не приходят в ответе вообще, не «на совести клиента». |
| Race condition между 30-сек pull и 800-мс push, блайнд-перезапись | Автопулла нет вовсе. Realtime-подписка (`subscribeToOwnChanges`) присылает точечное событие «эта строка изменилась» — применяется adресно, без «перезаписать весь массив». |
| Union-merge без удаления → снятый избранный вопрос воскресает | Избранное = наличие/отсутствие строки. Удаление = `delete`, реплицируется как есть, воскреснуть нечему. |
| Admin PIN, Apps Script URL, Telegram token в публичном JS | Anon key в клиенте — это ожидаемо публично (так и задумано в Supabase), но он ничего не может сделать за пределами RLS-политик. Создание аккаунтов вынесено в Edge Function с service-role ключом, который в браузер не попадает никогда. |
| Запись за чужого пользователя возможна, зная его PIN | Пишет всегда `auth.uid()` из проверенной сессии (JWT), а не строка `password`, присланная в теле запроса. Угадать PIN больше не значит получить доступ на запись. |

## Auth-модель: как сохранить PIN-вход, но не как «секрет = ключ доступа»

PIN превращается в пароль синтетического аккаунта `pin_<PIN>@starley.local` в `auth.users` Supabase — это даёт бесплатно: хэширование пароля, выдачу JWT-сессии, refresh-токены, базовую защиту от брутфорса на стороне Supabase Auth. UI логина не меняется (пользователь всё так же вводит 4-6 цифр), меняется только то, что происходит под капотом.

**Рекомендация:** в Supabase Dashboard → Authentication → Providers → Email выставить `Minimum password length` под длину вашего PIN, и для админского аккаунта сделать PIN длиннее обычных (например, 8+ цифр) — админ теперь физически не виден в исходниках, но как секрет для входа он всё ещё стоит того, чтобы его усилить.

## Шаги внедрения

1. **Создать проект Supabase** (supabase.com, бесплатный tier хватит с запасом).
2. **Накатить схему**: SQL Editor → вставить содержимое `schema.sql` → Run.
3. **Задеплоить Edge Function**:
   ```bash
   supabase functions deploy admin-create-user
   ```
4. **Смигрировать текущие данные** (пока Apps Script ещё жив и отдаёт `getAll`):
   ```bash
   export GOOGLE_SHEETS_WEB_APP_URL=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
   node migrate-from-sheets.mjs
   ```
   Сервис-роль ключ используется **только** в этом локальном скрипте, никогда в браузере.
5. **Прогнать выборочную проверку** — открыть Supabase Table Editor, сверить пару аккаунтов (избранное/плейлисты/сессии) с тем, что было в таблице.
6. **Подключить клиент**: в `quiz.html`/`index.html` заменить
   ```html
   <script src="assets/js/config.js"></script>
   <script src="assets/js/google-sheets-api.js"></script>
   <script src="assets/js/auth.js"></script>
   ```
   на
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
   <script src="assets/js/config.js"></script>
   <script src="assets/js/supabase-api.js"></script>
   <script src="assets/js/auth.js"></script>
   ```
   В `config.js` заменить `GOOGLE_SHEETS_WEB_APP_URL`/`TELEGRAM_*` на `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_FUNCTIONS_URL`.
7. **Переписать интеграцию в `auth.js`/`quiz.js`** — заменить вызовы `GoogleSheetsAPI.*` на `SupabaseAPI.*` (сигнатуры специально сделаны похожими, чтобы замена была почти механической: `loginWithPin`, `getFavorites`/`addFavorite`/`removeFavorite`, `getPlaylists`/`createPlaylist`/`togglePlaylistItem`, `saveSession`, `getSessionHistory`, `updateProfile`), убрать `schedulePush`/`pullFromSheets`/`startAutoSync` целиком — их заменяет `subscribeToOwnChanges`.
8. **Прогнать на паре аккаунтов параллельно со старой версией** несколько дней (можно держать оба бэкенда одновременно, просто не мигрировать разом всех).
9. **Отключить Apps Script деплой** и убрать `GOOGLE_SHEETS_WEB_APP_URL`/`TELEGRAM_BOT_TOKEN` из репозитория (и из истории git, если хотите — токен уже был публичным, стоит его ещё и отозвать в BotFather).

## Что не вошло в скелет (сделать по мере необходимости)

- UI-обвязка для admin-панели поверх `adminCreateUser` (сейчас только API).
- Offline-очередь на случай, если пользователь делает действия без сети (сейчас запросы просто зафейлятся; для PWA стоит добавить простую очередь в IndexedDB и ретраить при `online`).
- Экспорт/бэкап данных из Supabase (`pg_dump` по расписанию или Supabase's built-in backups на платных планах).
