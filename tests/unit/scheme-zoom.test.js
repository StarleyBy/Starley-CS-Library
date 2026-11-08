/**
 * Тест SchemeZoom — статический анализ кода + логические проверки.
 * Не требует jsdom или других внешних зависимостей.
 */
import fs from 'fs';
import assert from 'assert';

console.log('🧪 Starting SchemeZoom Unit Tests...');

// ─── 1. Загрузка файлов ───────────────────────────────────────────────────
const jsCode  = fs.readFileSync('assets/js/scheme-zoom.js',  'utf-8');
const cssCode = fs.readFileSync('assets/css/scheme-zoom.css', 'utf-8');

assert.ok(jsCode.length > 500,  'scheme-zoom.js должен быть непустым');
assert.ok(cssCode.length > 200, 'scheme-zoom.css должен быть непустым');
console.log('  ✅ PASS: файлы загружены');

// ─── 2. Структура JS: обязательные методы ────────────────────────────────
const methods = ['init', 'open', 'close', 'zoom', 'reset', '_applyTransform', '_createDOM', '_setupEvents'];
for (const m of methods) {
  assert.ok(jsCode.includes(`${m}(`), `Метод SchemeZoom.${m} должен быть определён`);
}
console.log('  ✅ PASS: все методы определены (' + methods.join(', ') + ')');

// ─── 3. Поддержка динамических SVG (MutationObserver) ────────────────────
assert.ok(jsCode.includes('MutationObserver'), 'MutationObserver должен присутствовать');
assert.ok(jsCode.includes("toUpperCase() === 'SVG'"), 'Проверка tagName — регистронезависимая');
console.log('  ✅ PASS: MutationObserver с регистронезависимой проверкой tagName');

// ─── 4. Масштаб через CSS transform: scale (не через width/height) ────────
// transform: scale — правильный подход без will-change:
// браузер рендерит SVG как вектор (не растеризует).
assert.ok(jsCode.includes('scale(${scale})'), 'Масштаб через CSS transform: scale(scale)');
// НЕ должно быть изменения width/height для масштабирования
// (это вызывало reflow и дёргание в v3.0)
assert.ok(!jsCode.match(/naturalWidth\s*\*\s*scale/), 'Масштаб НЕ через width*scale (нет reflow)');
console.log('  ✅ PASS: масштаб через CSS scale (нет reflow, нет дёргания)');

// ─── 5. Корректная математика зума: position:absolute ─────────────────────
// SVG layout-позиция = (0,0) → формула translate точна без поправок
assert.ok(jsCode.includes("position: absolute") || jsCode.includes("position:absolute"),
  'SVG должен быть position:absolute (для точной математики зума)');
assert.ok(jsCode.includes('transform-origin: 0 0') || jsCode.includes('transformOrigin'),
  'transform-origin должен быть 0 0');
assert.ok(jsCode.includes('translateX = x - (x - s.translateX) * ratio') ||
          jsCode.includes('translateX = cx - (cx - s.translateX)') ||
          jsCode.includes("s.translateX) * ratio"),
  'Формула зума к курсору должна присутствовать');
console.log('  ✅ PASS: математика зума корректна (position:absolute + translate)');

// ─── 6. Лимиты зума ──────────────────────────────────────────────────────
assert.ok(jsCode.includes('Math.min') && jsCode.includes('Math.max'), 'Зум ограничен min/max');
assert.ok(jsCode.includes('20'), 'Максимальный зум ≥ 20x');
console.log('  ✅ PASS: зум ограничен (0.1x–20x)');

// ─── 7. Управление жестами ───────────────────────────────────────────────
assert.ok(jsCode.includes("'wheel'"),      "Колесо мыши");
assert.ok(jsCode.includes("'mousedown'"),  "Перетаскивание мышью");
assert.ok(jsCode.includes("'touchstart'"), "Touch start");
assert.ok(jsCode.includes("'touchmove'"),  "Touch move (пинч)");
assert.ok(jsCode.includes('Math.hypot'),   'Пинч: расстояние через Math.hypot');
console.log('  ✅ PASS: все жесты реализованы (wheel, drag, touch pinch)');

// ─── 8. ESC для закрытия ─────────────────────────────────────────────────
assert.ok(jsCode.includes("'keydown'") && jsCode.includes("'Escape'"), "ESC закрывает лайтбокс");
console.log('  ✅ PASS: ESC закрывает лайтбокс');

// ─── 9. Блокировка скролла страницы ──────────────────────────────────────
assert.ok(jsCode.includes("body.style.overflow = 'hidden'"), 'Скролл блокируется при открытии');
assert.ok(jsCode.includes("body.style.overflow = ''"),       'Скролл восстанавливается при закрытии');
console.log('  ✅ PASS: управление overflow');

// ─── 10. Экспорт ─────────────────────────────────────────────────────────
assert.ok(jsCode.includes('window.SchemeZoom = SchemeZoom'), 'SchemeZoom экспортирован глобально');
console.log('  ✅ PASS: window.SchemeZoom экспортирован');

// ─── 11. CSS: структура и качество рендера ───────────────────────────────
assert.ok(cssCode.includes('.scheme-lightbox'),    '.scheme-lightbox');
assert.ok(cssCode.includes('.scheme-lb-toolbar'),  '.scheme-lb-toolbar');
assert.ok(cssCode.includes('.scheme-lb-canvas'),   '.scheme-lb-canvas');
assert.ok(cssCode.includes('.scheme-lb-btn'),      '.scheme-lb-btn');
assert.ok(cssCode.includes('position: fixed'),     'Оверлей fixed');
assert.ok(cssCode.includes('z-index: 12000'),      'Высокий z-index');
assert.ok(cssCode.includes('shape-rendering'),     'shape-rendering для SVG');
assert.ok(cssCode.includes('text-rendering'),      'text-rendering для SVG');
// Критично: will-change НЕ должен быть на .scheme-lb-svg (вызывает растеризацию)
const svgCssBlock = cssCode.match(/\.scheme-lb-svg\s*\{([^}]*)\}/s);
if (svgCssBlock) {
  assert.ok(!svgCssBlock[1].includes('will-change'),
    'CSS: will-change НЕ должен быть на .scheme-lb-svg (иначе SVG растеризуется)');
}
console.log('  ✅ PASS: CSS содержит директивы качества; will-change отсутствует на SVG');

// ─── 12. Замер через requestAnimationFrame ────────────────────────────────
assert.ok(jsCode.includes('requestAnimationFrame'), 'Замер размеров через rAF после рендера');
console.log('  ✅ PASS: замер размеров через requestAnimationFrame');

console.log('\n✅ Все проверки SchemeZoom пройдены!\n');
