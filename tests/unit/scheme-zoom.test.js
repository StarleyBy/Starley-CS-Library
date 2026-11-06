// Scheme Zoom integration test using jsdom
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the scheme-zoom script
const schemeZoomPath = path.resolve(__dirname, '../../assets/js/scheme-zoom.js');
const schemeZoomCode = fs.readFileSync(schemeZoomPath, 'utf-8');

describe('Scheme zoom overlay', () => {
  let window, document;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;
    // expose globals used by the script
    global.window = window;
    global.document = document;
    // mock PinchZoom (optional)
    window.PinchZoom = class { constructor(el, opts) {} };
    // Execute scheme-zoom.js to register handlers
    const scriptEl = document.createElement('script');
    scriptEl.textContent = schemeZoomCode;
    document.body.appendChild(scriptEl);
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  test('clicking on scheme-svg creates overlay', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'scheme-svg');
    document.body.appendChild(svg);
    const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    svg.dispatchEvent(clickEvent);
    const overlay = document.querySelector('.scheme-zoom-wrapper');
    expect(overlay).not.toBeNull();
    expect(overlay.querySelector('svg')).not.toBeNull();
  });
});
