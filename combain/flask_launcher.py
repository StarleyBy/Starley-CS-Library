"""
flask_launcher.py — сервер-посредник для запуска Комбайна Ф. Скорины из браузера.

Запуск:
    pip install flask
    python C:/MD/flask_launcher.py

Эндпоинты:
    POST /run    — запуск комбайна (если не запущен)
    GET  /status — статус и последние строки лога
"""

import sys
import threading
import subprocess
from pathlib import Path
from flask import Flask, jsonify
from flask.logging import default_handler
import logging

# ── Настройки ─────────────────────────────────────────────────────────────────

COMBINER_SCRIPT = Path("C:/MD/skoryna_combiner.py")
COMBINER_CWD    = Path("C:/MD")
FLASK_PORT      = 5000
LOG_TAIL        = 200   # максимум строк хранится в памяти

# ── Flask ─────────────────────────────────────────────────────────────────────

app = Flask(__name__)
app.logger.removeHandler(default_handler)
logging.getLogger('werkzeug').setLevel(logging.WARNING)

# ── Состояние ─────────────────────────────────────────────────────────────────

_state_lock = threading.Lock()
_running    = False
_log        = []      # список строк


def _append_log(line: str):
    global _log
    with _state_lock:
        _log.append(line)
        if len(_log) > LOG_TAIL:
            _log = _log[-LOG_TAIL:]


def _run_combiner():
    global _running, _log
    with _state_lock:
        _running = True
        _log = []

    _append_log("=== Комбайн Ф. Скорины — запуск ===")

    try:
        proc = subprocess.Popen(
            [sys.executable, str(COMBINER_SCRIPT)],
            cwd=str(COMBINER_CWD),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        for line in proc.stdout:
            _append_log(line.rstrip())
        proc.wait()
        rc = proc.returncode
        _append_log(f"=== Завершено (код {rc}) ===")
    except Exception as e:
        _append_log(f"ERROR: {e}")
    finally:
        with _state_lock:
            _running = False


# ── Эндпоинты ─────────────────────────────────────────────────────────────────

@app.after_request
def _cors(response):
    """Разрешаем запросы от локального HTML (file:// или localhost)."""
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/run", methods=["POST", "OPTIONS"])
def run():
    global _running
    if _running:
        return jsonify({"status": "already_running"})
    t = threading.Thread(target=_run_combiner, daemon=True)
    t.start()
    return jsonify({"status": "started"})


@app.route("/status", methods=["GET"])
def status():
    with _state_lock:
        return jsonify({
            "running": _running,
            "log"    : list(_log),
        })


# ── Точка входа ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if not COMBINER_SCRIPT.exists():
        print(f"[WARNING] Скрипт не найден: {COMBINER_SCRIPT}")
        print("          Убедитесь, что skoryna_combiner.py размещён в C:/MD/")

    print("=" * 50)
    print("  Комбайн Ф. Скорины — Launcher")
    print(f"  Слушает: http://localhost:{FLASK_PORT}")
    print(f"  Скрипт:  {COMBINER_SCRIPT}")
    print("  Для остановки: Ctrl+C")
    print("=" * 50)

    app.run(host="127.0.0.1", port=FLASK_PORT, debug=False)
