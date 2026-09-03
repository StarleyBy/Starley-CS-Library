import { HighlightsDB } from './db.js';
import { HighlightsExporter } from './exporter.js';

/**
 * Highlights Hub Logic & Card Rendering
 * Starley Medical Library
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('highlights-list');
  const emptyState = document.getElementById('hub-empty');
  const searchInput = document.getElementById('hub-search');
  const filterBadges = document.querySelectorAll('.filter-badge');
  const btnExportMd = document.getElementById('btn-export-md');
  const btnExportJson = document.getElementById('btn-export-json');
  const backToReadingBtn = document.getElementById('hub-back-to-reading-btn');

  let allHighlights = [];
  let currentColorFilter = 'all';

  // Apply dark theme if reader night-mode is active in localStorage
  try {
    const savedNight = localStorage.getItem('reader_night_mode');
    if (savedNight === 'true') {
      document.body.classList.add('night-mode');
    }
  } catch (e) {}

  // Language/Edition Detection
  const urlParams = new URLSearchParams(window.location.search);
  const urlEdition = urlParams.get('edition');
  const savedEdition = localStorage.getItem('reader_last_edition');
  const lang = (urlEdition === 'russian' || savedEdition === 'russian') ? 'ru' : 'en';

  // Back to Reading button setup
  if (backToReadingBtn) {
    let targetReaderUrl = null;

    // 1. URL parameters passed to highlights.html
    const urlBook = urlParams.get('book');
    const urlChapter = urlParams.get('chapter');
    if (urlBook) {
      targetReaderUrl = `reader.html?book=${encodeURIComponent(urlBook)}&chapter=${encodeURIComponent(urlChapter || '')}&edition=${encodeURIComponent(urlEdition || 'original')}`;
    }

    // 2. Referrer if coming from reader.html
    if (!targetReaderUrl && document.referrer && document.referrer.includes('reader.html')) {
      targetReaderUrl = document.referrer;
    }

    // 3. Last saved reader URL in localStorage
    if (!targetReaderUrl) {
      const savedReaderUrl = localStorage.getItem('starley_last_reader_url');
      if (savedReaderUrl) {
        targetReaderUrl = savedReaderUrl;
      }
    }

    // 4. Latest item in starley_recents
    if (!targetReaderUrl) {
      try {
        const recents = JSON.parse(localStorage.getItem('starley_recents') || '[]');
        if (recents && recents.length > 0) {
          const latest = recents[0];
          targetReaderUrl = `reader.html?book=${encodeURIComponent(latest.path)}&chapter=${encodeURIComponent(latest.chapter || '')}&edition=${encodeURIComponent(latest.edition || 'original')}`;
        }
      } catch (e) {}
    }

    // Fallback: Default reader page if no history
    if (!targetReaderUrl) {
      targetReaderUrl = 'reader.html';
    }

    backToReadingBtn.href = targetReaderUrl;
    backToReadingBtn.style.display = 'inline-flex';
  }

  // UI Localization
  const t = I18N_HUB[lang];
  function applyLocalization() {
    document.documentElement.lang = lang;
    document.title = t.title;
    const hubTitleEl = document.querySelector('.hub-title');
    if (hubTitleEl) hubTitleEl.innerHTML = t.headerTitle;

    const backLibBtn = document.getElementById('hub-back-library-btn');
    if (backLibBtn) backLibBtn.innerHTML = t.backLibrary;

    if (backToReadingBtn) {
      backToReadingBtn.innerHTML = `<i class="fas fa-book-open"></i> ` + t.backReading;
    }

    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    if (btnExportMd) btnExportMd.innerHTML = `<i class="fas fa-file-markdown"></i> ` + t.exportMd;
    if (btnExportJson) btnExportJson.innerHTML = `<i class="fas fa-file-code"></i> ` + t.exportJson;

    // Filter badges
    if (filterBadges.length >= 10) {
      filterBadges[0].textContent = t.filterAll;
      filterBadges[1].textContent = t.filterYellow;
      filterBadges[2].textContent = t.filterGreen;
      filterBadges[3].textContent = t.filterBlue;
      filterBadges[4].textContent = t.filterRed;
      filterBadges[5].textContent = t.filterPurple;
      filterBadges[6].textContent = t.filterOrange;
      filterBadges[7].textContent = t.filterPink;
      filterBadges[8].textContent = t.filterTeal;
      filterBadges[9].textContent = t.filterNotes;
    }

    // Empty state
    const emptyTitleEl = emptyState.querySelector('h3');
    const emptyDescEl = emptyState.querySelector('p');
    if (emptyTitleEl) emptyTitleEl.textContent = t.emptyTitle;
    if (emptyDescEl) emptyDescEl.textContent = t.emptyDesc;
  }
  applyLocalization();

  async function loadData() {
    allHighlights = await HighlightsDB.getAll();
    allHighlights.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    render();
  }

  function getCategoryInfo(color) {
    switch (color) {
      case 'yellow': return { icon: '🟡', label: lang === 'ru' ? 'Важное' : 'Important' };
      case 'green':  return { icon: '🟢', label: lang === 'ru' ? 'Дозировки / Схемы' : 'Dosage / Meds' };
      case 'blue':   return { icon: '🔵', label: lang === 'ru' ? 'Протоколы' : 'Protocol' };
      case 'red':    return { icon: '🔴', label: lang === 'ru' ? 'Противопоказания' : 'Contraindication' };
      case 'purple': return { icon: '🟣', label: lang === 'ru' ? 'Запомнить' : 'Remember' };
      case 'orange': return { icon: '🟠', label: lang === 'ru' ? 'Интересно' : 'Interesting' };
      case 'pink':   return { icon: '🩷', label: lang === 'ru' ? 'Ничего себе' : 'Wow!' };
      case 'teal':   return { icon: '🛠️', label: lang === 'ru' ? 'Техника' : 'Technique' };
      default:       return { icon: '🔖', label: lang === 'ru' ? 'Выделение' : 'Highlight' };
    }
  }

  function render() {
    container.innerHTML = '';
    const query = (searchInput.value || '').toLowerCase().trim();

    const filtered = allHighlights.filter(hl => {
      // Color filter check
      if (currentColorFilter === 'has-note' && !hl.note) return false;
      if (currentColorFilter !== 'all' && currentColorFilter !== 'has-note' && hl.color !== currentColorFilter) return false;

      // Text search check
      if (query) {
        const textMatch = (hl.selectedText || '').toLowerCase().includes(query);
        const noteMatch = (hl.note || '').toLowerCase().includes(query);
        const bookMatch = (hl.bookId || '').toLowerCase().includes(query);
        const chapterMatch = (hl.chapterId || '').toLowerCase().includes(query);
        return textMatch || noteMatch || bookMatch || chapterMatch;
      }
      return true;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(hl => {
      const card = document.createElement('div');
      card.className = `hl-card card-${hl.color || 'yellow'}`;

      const catInfo = getCategoryInfo(hl.color);
      const dateStr = hl.createdAt ? new Date(hl.createdAt).toLocaleDateString() : '';
      const bookLabel = hl.bookId ? `${hl.bookId} / ${hl.chapterId || ''}` : 'Book';

      const targetUrl = `reader.html?book=${encodeURIComponent(hl.bookId || '')}&chapter=${encodeURIComponent(hl.chapterId || '')}&edition=${lang === 'ru' ? 'russian' : 'original'}&hl_id=${encodeURIComponent(hl.id)}`;

      card.innerHTML = `
        <div class="hl-card-header">
          <span class="hl-card-category">${catInfo.icon} ${catInfo.label}</span>
          <span>${dateStr}</span>
        </div>
        <blockquote class="hl-card-quote">“${escapeHtml(hl.selectedText)}”</blockquote>
        ${hl.note ? `<div class="hl-card-note"><strong>📝 ${lang === 'ru' ? 'Заметка' : 'Note'}:</strong> ${escapeHtml(hl.note)}</div>` : ''}
        <div class="hl-card-footer">
          <span style="font-size:0.75rem; opacity:0.8;">📍 ${lang === 'ru' ? 'Книга' : 'Book'}: ${escapeHtml(bookLabel)}</span>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="hl-card-delete" data-id="${hl.id}" title="Delete highlight">🗑️</button>
            <a href="${targetUrl}" class="hl-card-link">${t.cardJump}</a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event Bindings
  if (searchInput) {
    searchInput.addEventListener('input', () => render());
  }

  filterBadges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      filterBadges.forEach(b => b.classList.remove('is-active'));
      e.target.classList.add('is-active');
      currentColorFilter = e.target.dataset.color;
      render();
    });
  });

  if (container) {
    container.addEventListener('click', async (e) => {
      const delBtn = e.target.closest('.hl-card-delete');
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (confirm(t.cardDeleteConfirm)) {
          await HighlightsDB.removeHighlight(id);
          allHighlights = allHighlights.filter(h => h.id !== id);
          render();
        }
      }
    });
  }

  if (btnExportMd) {
    btnExportMd.addEventListener('click', () => HighlightsExporter.exportToMarkdown());
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => HighlightsExporter.exportToJSON());
  }

  await loadData();
});

const I18N_HUB = {
  ru: {
    title: "Мои заметки и выделения - Starley CS Library",
    headerTitle: "🔖 Мои заметки и выделения",
    backLibrary: "← В библиотеку",
    backReading: "← К чтению",
    searchPlaceholder: "Поиск в заметках и выделениях...",
    exportMd: "Экспорт MD",
    exportJson: "Экспорт JSON",
    filterAll: "Все выделения",
    filterYellow: "🟡 Важное",
    filterGreen: "🟢 Дозировки / Схемы",
    filterBlue: "🔵 Протоколы",
    filterRed: "🔴 Противопоказания",
    filterPurple: "🟣 Запомнить",
    filterOrange: "🟠 Интересно",
    filterPink: "🩷 Ничего себе",
    filterTeal: "🛠️ Техника",
    filterNotes: "📝 Только заметки",
    emptyTitle: "Заметки не найдены",
    emptyDesc: "Выделите текст при чтении любой книги, чтобы добавить маркер и заметку.",
    cardJump: "Перейти к тексту →",
    cardDeleteConfirm: "Удалить это выделение?",
    bookLabel: "Книга",
    noteHeader: "Заметка:"
  },
  en: {
    title: "My Highlights & Notes - Starley CS Library",
    headerTitle: "🔖 My Highlights & Notes",
    backLibrary: "← Library",
    backReading: "← Back to Reading",
    searchPlaceholder: "Search in highlights & notes...",
    exportMd: "Export MD",
    exportJson: "Export JSON",
    filterAll: "All Highlights",
    filterYellow: "🟡 Important",
    filterGreen: "🟢 Dosages / Meds",
    filterBlue: "🔵 Protocols",
    filterRed: "🔴 Contraindications",
    filterPurple: "🟣 Remember",
    filterOrange: "🟠 Interesting",
    filterPink: "🩷 Wow!",
    filterTeal: "🛠️ Technique",
    filterNotes: "📝 Notes Only",
    emptyTitle: "No highlights found",
    emptyDesc: "Select text while reading any book to highlight key passages and add notes.",
    cardJump: "Jump to text →",
    cardDeleteConfirm: "Delete this highlight?",
    bookLabel: "Book",
    noteHeader: "Note:"
  }
};

