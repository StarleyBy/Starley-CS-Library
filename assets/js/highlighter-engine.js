import { HighlightsDB } from './db.js';

/**
 * Robust Safe DOM Range Walking & Context Quote Anchoring Engine
 * Starley Medical Library
 */
export class HighlighterEngine {
  constructor(container, bookId, chapterId) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.bookId = bookId || 'default';
    this.chapterId = chapterId || 'ch_main';

    if (this.container) {
      this.init();
    }
  }

  async init() {
    this.container = typeof this.container === 'string' ? document.querySelector(this.container) : this.container;
    if (!this.container) return;

    await this.restoreHighlights();
    this.handleUrlTarget();
  }

  /**
   * Fast hash for paragraph / block Identification
   */
  static generateHash(str) {
    let hash = 0;
    const cleanStr = (str || '').trim();
    for (let i = 0; i < cleanStr.length; i++) {
      hash = (hash << 5) - hash + cleanStr.charCodeAt(i);
      hash |= 0;
    }
    return 'p_' + Math.abs(hash).toString(16);
  }

  /**
   * Creates resilient anchor with paragraph hash + text quote context
   */
  createAnchor(range) {
    const startNode = range.startContainer;
    const parentBlock = (startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : startNode)
      .closest('p, li, blockquote, h1, h2, h3, h4, td, div.content');

    if (!parentBlock) return null;

    const fullText = parentBlock.textContent || '';
    const paragraphHash = HighlighterEngine.generateHash(fullText);

    // Compute relative start and end offsets inside parentBlock text
    const preRange = document.createRange();
    preRange.selectNodeContents(parentBlock);
    try {
      preRange.setEnd(range.startContainer, range.startOffset);
    } catch (e) {
      preRange.setStartBefore(parentBlock);
    }
    
    const startOffset = preRange.toString().length;
    const exactText = range.toString().trim();
    const endOffset = startOffset + exactText.length;

    const prefix = fullText.substring(Math.max(0, startOffset - 30), startOffset);
    const suffix = fullText.substring(endOffset, Math.min(fullText.length, endOffset + 30));

    return {
      paragraphHash,
      startOffset,
      endOffset,
      quote: {
        exact: exactText,
        prefix,
        suffix
      }
    };
  }

  /**
   * Safe Text Node Walker - Wraps ONLY Node.TEXT_NODE to prevent DOMException
   */
  wrapRange(range, highlightRecord) {
    const { id, color, note } = highlightRecord;
    const textNodes = [];

    const rootContainer = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer;

    const walker = document.createTreeWalker(
      rootContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest('mark.cs-highlight')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    if (textNodes.length === 0) return;

    textNodes.forEach((node) => {
      const nodeRange = document.createRange();
      nodeRange.selectNode(node);

      if (node === range.startContainer) {
        nodeRange.setStart(node, range.startOffset);
      }
      if (node === range.endContainer) {
        nodeRange.setEnd(node, range.endOffset);
      }

      if (nodeRange.toString().length === 0) return;

      const mark = document.createElement('mark');
      mark.className = `cs-highlight cs-highlight-${color}`;
      mark.dataset.hlId = id;
      mark.dataset.color = color;
      if (note) {
        mark.dataset.note = note;
        mark.title = `Note: ${note}`;
        mark.classList.add('has-note');
      }

      try {
        const extracted = nodeRange.extractContents();
        mark.appendChild(extracted);
        nodeRange.insertNode(mark);
      } catch (e) {
        console.warn('[HighlighterEngine] Fallback wrapping for node:', e);
      }
    });
  }

  /**
   * Applies highlight to current user selection and saves to IndexedDB
   */
  async applyHighlight(color, noteText = '') {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return null;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    if (!selectedText) return null;

    const anchor = this.createAnchor(range);
    if (!anchor) return null;

    const highlightRecord = {
      id: 'hl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      bookId: this.bookId,
      chapterId: this.chapterId,
      selectedText,
      color,
      note: noteText,
      anchor,
      createdAt: Date.now()
    };

    this.wrapRange(range, highlightRecord);
    await HighlightsDB.saveHighlight(highlightRecord);

    selection.removeAllRanges();
    return highlightRecord;
  }

  /**
   * Removes highlight from DOM and IndexedDB
   */
  async removeHighlight(id) {
    const marks = this.container.querySelectorAll(`mark[data-hl-id="${id}"]`);
    marks.forEach(mark => {
      const parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });

    await HighlightsDB.removeHighlight(id);
  }

  /**
   * Updates note text for an existing highlight
   */
  async updateNote(id, noteText) {
    const marks = this.container.querySelectorAll(`mark[data-hl-id="${id}"]`);
    marks.forEach(mark => {
      if (noteText) {
        mark.dataset.note = noteText;
        mark.title = `Note: ${noteText}`;
        mark.classList.add('has-note');
      } else {
        delete mark.dataset.note;
        mark.removeAttribute('title');
        mark.classList.remove('has-note');
      }
    });

    await HighlightsDB.updateNote(id, noteText);
  }

  /**
   * Restores highlights for current book & chapter from IndexedDB
   */
  async restoreHighlights() {
    const highlights = await HighlightsDB.getHighlights(this.bookId, this.chapterId);
    if (!highlights || highlights.length === 0) return;

    const blocks = Array.from(this.container.querySelectorAll('p, li, blockquote, h1, h2, h3, h4, td'));

    highlights.forEach((hl) => {
      let matchedBlock = blocks.find(b => HighlighterEngine.generateHash(b.textContent) === hl.anchor.paragraphHash);

      // Fuzzy matching fallback if text/hash shifted
      if (!matchedBlock && hl.anchor.quote && hl.anchor.quote.exact) {
        matchedBlock = blocks.find(b => (b.textContent || '').includes(hl.anchor.quote.exact));
      }

      if (matchedBlock) {
        this.restoreSingleAnchor(matchedBlock, hl);
      }
    });
  }

  /**
   * Restores single anchor in matched DOM block
   */
  restoreSingleAnchor(block, hl) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
    let currentLen = 0;
    let startNode = null, startOffset = 0;
    let endNode = null, endOffset = 0;

    const targetStart = hl.anchor.startOffset;
    const targetEnd = hl.anchor.endOffset;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const len = node.textContent.length;

      if (!startNode && currentLen + len >= targetStart) {
        startNode = node;
        startOffset = targetStart - currentLen;
      }
      if (!endNode && currentLen + len >= targetEnd) {
        endNode = node;
        endOffset = targetEnd - currentLen;
        break;
      }
      currentLen += len;
    }

    // Fallback: search for exact text in block if offset calculation shifted
    if (!startNode || !endNode) {
      const fullText = block.textContent;
      const exactIndex = fullText.indexOf(hl.selectedText);
      if (exactIndex !== -1) {
        const exactEnd = exactIndex + hl.selectedText.length;
        const subWalker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
        let subLen = 0;
        startNode = null; endNode = null;
        while (subWalker.nextNode()) {
          const node = subWalker.currentNode;
          const len = node.textContent.length;
          if (!startNode && subLen + len >= exactIndex) {
            startNode = node;
            startOffset = exactIndex - subLen;
          }
          if (!endNode && subLen + len >= exactEnd) {
            endNode = node;
            endOffset = exactEnd - subLen;
            break;
          }
          subLen += len;
        }
      }
    }

    if (startNode && endNode) {
      try {
        const range = document.createRange();
        range.setStart(startNode, Math.min(startOffset, startNode.textContent.length));
        range.setEnd(endNode, Math.min(endOffset, endNode.textContent.length));
        this.wrapRange(range, hl);
      } catch (e) {
        console.warn('[HighlighterEngine] Error restoring anchor:', e);
      }
    }
  }

  /**
   * Handles target highlight from URL query parameter ?hl_id=...
   */
  handleUrlTarget() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('hl_id');
    if (!targetId) return;

    setTimeout(() => {
      const mark = this.container.querySelector(`mark[data-hl-id="${targetId}"]`);
      if (mark) {
        // Walk up parents to open any collapsed <details> or hidden parent containers
        let parent = mark.parentElement;
        let openedAny = false;
        while (parent && parent !== this.container) {
          if (parent.tagName === 'DETAILS') {
            if (!parent.open) {
              parent.open = true;
              openedAny = true;
            }
          }
          if (parent.classList.contains('collapsed') || parent.classList.contains('hidden')) {
            parent.classList.remove('collapsed', 'hidden');
            openedAny = true;
          }
          if (parent.style.display === 'none') {
            parent.style.display = '';
            openedAny = true;
          }
          parent = parent.parentElement;
        }

        const performScroll = () => {
          mark.classList.add('cs-highlight-pulse');
          mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => mark.classList.remove('cs-highlight-pulse'), 3000);
        };

        if (openedAny) {
          // Wait for browser layout reflow after opening collapsed elements
          requestAnimationFrame(() => {
            setTimeout(performScroll, 50);
          });
        } else {
          performScroll();
        }
      }
    }, 450);
  }
}

if (typeof window !== 'undefined') {
  window.HighlighterEngine = HighlighterEngine;
}
