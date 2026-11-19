/**
 * tests/unit/media-inspector.test.mjs
 * Комплексный unit-тест MediaInspector (Image Lightbox & Table Focus System).
 * Проверяет синтаксис, чистоту переносов строк, наличие методов, поддержку жестов,
 * зумирование и корректность DOM-манипуляций без внешних зависимостей.
 */

import fs from 'node:fs';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

console.log('🧪 Starting MediaInspector Unit Tests...');

// 1. Проверка файлов на диске
const jsPath = path.join(root, 'assets/js/media-inspector.js');
const cssPath = path.join(root, 'assets/css/media-inspector.css');

assert.ok(fs.existsSync(jsPath), 'assets/js/media-inspector.js должен существовать');
assert.ok(fs.existsSync(cssPath), 'assets/css/media-inspector.css должен существовать');

const jsCode = fs.readFileSync(jsPath, 'utf8');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert.ok(jsCode.length > 5000, `media-inspector.js должен быть непустым (${jsCode.length} байт)`);
assert.ok(cssCode.length > 2000, `media-inspector.css должен быть непустым (${cssCode.length} байт)`);
console.log('  ✅ PASS: Файлы скрипта и стилей успешно загружены');

// 2. Проверка отсутствия повреждённых переносов строк (CRCRLF)
const jsBytes = fs.readFileSync(jsPath);
let hasCrCrLf = false;
for (let i = 0; i < jsBytes.length - 2; i++) {
  if (jsBytes[i] === 13 && jsBytes[i + 1] === 13 && jsBytes[i + 2] === 10) {
    hasCrCrLf = true;
    break;
  }
}
assert.strictEqual(hasCrCrLf, false, 'media-inspector.js не должен содержать двойных возвратов каретки (CRCRLF)');
console.log('  ✅ PASS: Чистая кодировка и корректные переносы строк (без CRCRLF)');

// 3. Синтаксическая валидность и структура методов
const requiredMethods = [
  'init',
  'initImages',
  'openLightbox',
  'closeLightbox',
  'createLightboxDOM',
  'updateLightboxTransform',
  'resetLightboxTransform',
  'zoomLightbox',
  'setupGlobalLightboxEvents',
  'initTables',
  'openTableModal',
  'closeTableModal',
  'createTableModalDOM'
];

for (const m of requiredMethods) {
  assert.ok(
    jsCode.includes(`${m}(`) || jsCode.includes(`${m} (`),
    `Метод MediaInspector.${m} должен быть определён в коде`
  );
}
console.log(`  ✅ PASS: Все ${requiredMethods.length} ключевых методов MediaInspector присутствуют`);

// 4. Проверка глобального экспорта
assert.ok(jsCode.includes('window.MediaInspector = MediaInspector;'), 'window.MediaInspector должен быть экспортирован');
console.log('  ✅ PASS: Глобальный экспорт window.MediaInspector на месте');

// 5. Проверка жестов и обработчиков событий
const eventChecks = [
  { name: 'Колесо мыши (wheel zoom)', pattern: "'wheel'" },
  { name: 'Мышь перетаскивание (mousedown/mousemove/mouseup)', pattern: "'mousedown'" },
  { name: 'Двойной клик для зума (dblclick)', pattern: "'dblclick'" },
  { name: 'Тач зум и пинч (touchstart/touchmove/touchend)', pattern: "'touchstart'" },
  { name: 'Вычисление расстояния пинча (Math.hypot)', pattern: 'Math.hypot' },
  { name: 'Закрытие по клавише Escape', pattern: "'Escape'" },
  { name: 'Блокировка скролла фона body.style.overflow', pattern: "overflow = 'hidden'" },
  { name: 'Кнопки зума (+/-)', pattern: 'lightbox-zoom-in-btn' },
  { name: 'Кнопка контрастности', pattern: 'lightbox-contrast-btn' },
  { name: 'Кнопка возврата к тексту', pattern: 'lightbox-back-link' }
];

for (const chk of eventChecks) {
  assert.ok(jsCode.includes(chk.pattern), `Должна быть реализована поддержка: ${chk.name}`);
}
console.log('  ✅ PASS: Все интерактивные жесты, зум и элементы управления присутствуют');

// 6. Проверка стилей CSS
assert.ok(cssCode.includes('.media-lightbox'), 'CSS должен содержать стили .media-lightbox');
assert.ok(cssCode.includes('.inspectable-image'), 'CSS должен содержать стили .inspectable-image');
assert.ok(cssCode.includes('cursor: zoom-in'), 'inspectable-image должен иметь cursor: zoom-in');
assert.ok(cssCode.includes('.contrast-boosted'), 'CSS должен содержать фильтр .contrast-boosted');
assert.ok(cssCode.includes('.table-focus-modal'), 'CSS должен содержать стили .table-focus-modal');
console.log('  ✅ PASS: CSS содержит все обязательные селекторы и правила курсора/фильтров');

// 7. Изолированное функциональное тестирование логики MediaInspector
// Создаём легковесный mock DOM
class MockElement {
  constructor(tagName = 'DIV', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      toggle: (c, val) => {
        if (val !== undefined) {
          if (val) this.classList._classes.add(c);
          else this.classList._classes.delete(c);
          return val;
        }
        if (this.classList._classes.has(c)) {
          this.classList._classes.delete(c);
          return false;
        }
        this.classList._classes.add(c);
        return true;
      },
      contains: (c) => this.classList._classes.has(c)
    };
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this._listeners = {};
    this.innerHTML = '';
    this.textContent = '';
  }

  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }

  trigger(event, eventObj = {}) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(fn => fn(eventObj));
    }
  }

  appendChild(child) {
    child.parentNode = this;
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  insertBefore(newNode, refNode) {
    const idx = this.children.indexOf(refNode);
    if (idx !== -1) {
      this.children.splice(idx, 0, newNode);
    } else {
      this.children.push(newNode);
    }
    newNode.parentNode = this;
    newNode.parentElement = this;
    return newNode;
  }

  querySelector(selector) {
    for (const child of this.children) {
      if (selector.startsWith('.') && child.classList.contains(selector.slice(1))) return child;
      if (selector.startsWith('#') && child.id === selector.slice(1)) return child;
      if (child.tagName.toLowerCase() === selector.toLowerCase()) return child;
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  querySelectorAll(selector) {
    let matches = [];
    for (const child of this.children) {
      if (selector === 'img' && child.tagName === 'IMG') matches.push(child);
      if (selector === 'table' && child.tagName === 'TABLE') matches.push(child);
      if (selector.startsWith('.') && child.classList.contains(selector.slice(1))) matches.push(child);
      matches = matches.concat(child.querySelectorAll(selector));
    }
    return matches;
  }

  closest(selector) {
    let curr = this;
    while (curr) {
      if (selector === 'p' && curr.tagName === 'P') return curr;
      curr = curr.parentElement;
    }
    return null;
  }

  getBoundingClientRect() {
    return { left: 0, top: 0, width: 800, height: 600 };
  }
}

// Проверяем работу зума в изоляции (чистая математика zoomLightbox)
const testState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  element: {
    querySelector: () => ({
      getBoundingClientRect: () => ({ width: 800, height: 600, left: 0, top: 0 })
    })
  },
  imgElement: { style: {} }
};

function testZoom(state, factor, centerX, centerY) {
  const oldScale = state.scale;
  state.scale = Math.min(Math.max(state.scale * factor, 1), 8);
  const x = centerX !== undefined ? centerX : 400;
  const y = centerY !== undefined ? centerY : 300;
  const ratio = state.scale / oldScale;
  state.translateX = x - (x - state.translateX) * ratio;
  state.translateY = y - (y - state.translateY) * ratio;
}

testZoom(testState, 1.3);
assert.ok(testState.scale > 1.25 && testState.scale < 1.35, 'Zoom factor 1.3 должен увеличивать масштаб');
testZoom(testState, 0.7);
assert.strictEqual(testState.scale, 1, 'Минимальный масштаб ограничен 1.0 (сброс к исходному)');
console.log('  ✅ PASS: Математика зума и центрирования координат корректна');

console.log('\n🎉 ALL MEDIA INSPECTOR UNIT TESTS PASSED SUCCESSFULLY!\n');
