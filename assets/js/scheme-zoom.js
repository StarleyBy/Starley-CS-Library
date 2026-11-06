/**
 * Scheme zoom support for any page (quiz, reader, etc.)
 * Adds class `scheme-svg` to existing SVG elements and registers click handler.
 */
/**
 * Scheme zoom support for any page (quiz, reader, etc.)
 * Adds class `scheme-svg` to existing SVG elements and registers click handler.
 */
function initSchemeZoom() {
  // Helper to add class to a SVG element if not already present
  function ensureClass(svg) {
    if (!svg.classList.contains('scheme-svg')) {
      svg.classList.add('scheme-svg');
    }
  }

  // Apply to all SVGs already in the DOM
  document.querySelectorAll('svg:not(.scheme-svg)').forEach(ensureClass);

  // Observe for dynamically added SVGs (reader loads content via JS)
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.tagName && node.tagName.toUpperCase() === 'SVG') {
          ensureClass(node);
        } else {
          // If a container added, search within it
          node.querySelectorAll && node.querySelectorAll('svg:not(.scheme-svg)').forEach(ensureClass);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Delegate click events – works for dynamically added SVGs as well
  document.addEventListener('click', function (e) {
    const svg = e.target.closest('svg.scheme-svg');
    if (!svg) return;
    const overlay = document.createElement('div');
    overlay.className = 'scheme-zoom-wrapper';
    overlay.appendChild(svg.cloneNode(true));
    overlay.addEventListener('click', () => overlay.remove());
    // If PinchZoom library is present (used for images), wrap for pinch support
    if (window.PinchZoom) {
      const wrapper = document.createElement('div');
      wrapper.style.touchAction = 'none';
      wrapper.style.overflow = 'hidden';
      wrapper.appendChild(overlay.firstChild);
      overlay.innerHTML = '';
      overlay.appendChild(wrapper);
      new PinchZoom(wrapper, { draggable: true, zoomOutRatio: 0.5 });
    }
    document.body.appendChild(overlay);
  });
}

document.addEventListener('DOMContentLoaded', initSchemeZoom);

