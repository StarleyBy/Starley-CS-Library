/**
 * combiner-launcher.js
 * Управляет связью editor.html ↔ flask_launcher.py (localhost:5000)
 *
 * Состояния индикатора:
 *   combiner-indicator--off      — лаунчер не проверялся / недоступен
 *   combiner-indicator--ready    — лаунчер доступен, комбайн не запущен
 *   combiner-indicator--running  — комбайн работает (пульсация)
 *   combiner-indicator--done     — последний запуск завершён успешно
 *   combiner-indicator--error    — ошибка подключения или выполнения
 */

(function () {
    'use strict';

    const LAUNCHER_URL   = 'http://localhost:5000';
    const POLL_INTERVAL  = 2000;   // мс — интервал опроса во время работы
    const CHECK_TIMEOUT  = 3000;   // мс — таймаут проверки доступности

    // ── DOM ───────────────────────────────────────────────────────────────────

    const elIndicator  = document.getElementById('combiner-indicator');
    const elStatusText = document.getElementById('combiner-status-text');
    const elBtnRun     = document.getElementById('btn-combiner-run');
    const elBtnCheck   = document.getElementById('btn-combiner-check');
    const elLogWrap    = document.getElementById('combiner-log-wrap');
    const elLog        = document.getElementById('combiner-log');
    const elLogClear   = document.getElementById('btn-combiner-log-clear');

    if (!elIndicator) return; // секция не найдена — выходим

    // ── Состояние ─────────────────────────────────────────────────────────────

    let pollTimer      = null;
    let lastLogLength  = 0;
    let isConnected    = false;

    // ── Утилиты ───────────────────────────────────────────────────────────────

    function setIndicator(state, text) {
        elIndicator.className = `combiner-indicator combiner-indicator--${state}`;
        elStatusText.textContent = text;
    }

    function appendLog(lines) {
        if (!lines || lines.length === 0) return;
        const newLines = lines.slice(lastLogLength);
        if (newLines.length === 0) return;
        lastLogLength = lines.length;

        elLogWrap.style.display = 'block';
        newLines.forEach(line => {
            const row = document.createElement('div');
            row.className = 'combiner-log-line' + (
                line.includes('✓') ? ' combiner-log-ok' :
                line.includes('ERROR') || line.includes('Ошибка') ? ' combiner-log-err' :
                line.includes('===') ? ' combiner-log-head' : ''
            );
            row.textContent = line;
            elLog.appendChild(row);
        });
        // Автоскролл вниз
        elLog.scrollTop = elLog.scrollHeight;
    }

    function clearLog() {
        elLog.innerHTML = '';
        lastLogLength   = 0;
        elLogWrap.style.display = 'none';
    }

    // ── Fetch с таймаутом ─────────────────────────────────────────────────────

    async function fetchWithTimeout(url, options = {}, timeout = CHECK_TIMEOUT) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return res;
        } catch (e) {
            clearTimeout(id);
            throw e;
        }
    }

    // ── Проверка соединения ───────────────────────────────────────────────────

    async function checkConnection() {
        setIndicator('off', 'Connecting…');
        elBtnCheck.disabled = true;
        try {
            const res  = await fetchWithTimeout(`${LAUNCHER_URL}/status`);
            const data = await res.json();
            isConnected = true;
            elBtnRun.disabled = false;

            if (data.running) {
                setIndicator('running', 'Combiner is running…');
                startPolling();
            } else {
                setIndicator('ready', 'Launcher ready');
                appendLog(data.log);
            }
        } catch {
            isConnected = false;
            elBtnRun.disabled = true;
            setIndicator('error', 'Launcher not available');
        } finally {
            elBtnCheck.disabled = false;
        }
    }

    // ── Запуск комбайна ───────────────────────────────────────────────────────

    async function runCombiner() {
        if (!isConnected) return;
        clearLog();
        lastLogLength = 0;
        elBtnRun.disabled = true;
        setIndicator('running', 'Starting…');

        try {
            const res  = await fetchWithTimeout(`${LAUNCHER_URL}/run`, { method: 'POST' });
            const data = await res.json();

            if (data.status === 'already_running') {
                setIndicator('running', 'Already running…');
                startPolling();
                return;
            }
            // started
            setIndicator('running', 'Combiner running…');
            startPolling();
        } catch {
            setIndicator('error', 'Failed to start combiner');
            elBtnRun.disabled = false;
        }
    }

    // ── Поллинг статуса ───────────────────────────────────────────────────────

    function startPolling() {
        stopPolling();
        pollTimer = setInterval(pollStatus, POLL_INTERVAL);
    }

    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    async function pollStatus() {
        try {
            const res  = await fetchWithTimeout(`${LAUNCHER_URL}/status`, {}, 2000);
            const data = await res.json();

            appendLog(data.log);

            if (!data.running) {
                stopPolling();
                elBtnRun.disabled = false;
                // Определяем итог по последним строкам лога
                const lastLines = (data.log || []).slice(-5).join(' ');
                if (lastLines.includes('ERROR') || lastLines.includes('Ошибка')) {
                    setIndicator('error', 'Finished with errors');
                } else {
                    setIndicator('done', 'Completed successfully');
                }
            }
        } catch {
            stopPolling();
            setIndicator('error', 'Connection lost');
            elBtnRun.disabled = false;
        }
    }

    // ── Привязка событий ──────────────────────────────────────────────────────

    elBtnRun.addEventListener('click',   runCombiner);
    elBtnCheck.addEventListener('click', checkConnection);
    elLogClear.addEventListener('click', clearLog);

})();
