/**
 * Contextual Floating Selection Toolbar & Note Popover UI Component
 * Starley Medical Library
 */
export class HighlightToolbar {
  constructor(engine) {
    this.engine = engine;
    this.toolbarEl = null;
    this.popoverEl = null;
    this.activeMarkId = null;
    this.selectionDebounce = null;

    if (this.engine && this.engine.container) {
      this.init();
    }
  }

  getLang() {
    return document.documentElement.lang === 'ru' ? 'ru' : 'en';
  }

  init() {
    this.destroy();
    this.renderToolbar();
    this.renderPopover();
    this.renderQuizModal();
    this.bindEvents();
  }

  renderToolbar() {
    const lang = this.getLang();
    const t = I18N[lang];
    this.toolbarEl = document.createElement('div');
    this.toolbarEl.className = 'cs-hl-toolbar';
    this.toolbarEl.innerHTML = `
      <div class="cs-hl-toolbar-colors">
        <button class="cs-hl-color-btn" data-color="yellow" title="${t.yellow}"></button>
        <button class="cs-hl-color-btn" data-color="green" title="${t.green}"></button>
        <button class="cs-hl-color-btn" data-color="blue" title="${t.blue}"></button>
        <button class="cs-hl-color-btn" data-color="red" title="${t.red}"></button>
        <button class="cs-hl-color-btn" data-color="purple" title="${t.purple}"></button>
        <button class="cs-hl-color-btn" data-color="orange" title="${t.orange}"></button>
        <button class="cs-hl-color-btn" data-color="pink" title="${t.pink}"></button>
        <button class="cs-hl-color-btn" data-color="teal" title="${t.teal}"></button>
        <button class="cs-hl-quiz-btn" id="cs-hl-quiz-btn" title="${t.addToQuiz}">🎴</button>
      </div>
      <div class="cs-hl-toolbar-divider"></div>
      <input type="text" class="cs-hl-toolbar-input" id="cs-hl-note-input" placeholder="${t.notePlaceholder}" aria-label="${t.notePlaceholder}" />
      <button class="cs-hl-toolbar-close" id="cs-hl-close-btn" title="${t.close}">✕</button>
    `;
    document.body.appendChild(this.toolbarEl);
  }

  renderPopover() {
    const lang = this.getLang();
    const t = I18N[lang];
    this.popoverEl = document.createElement('div');
    this.popoverEl.className = 'cs-hl-popover';
    this.popoverEl.innerHTML = `
      <div class="cs-hl-popover-header">
        <span>${t.popoverHeader}</span>
        <button class="cs-hl-toolbar-close" id="cs-hl-popover-close">✕</button>
      </div>
      <textarea class="cs-hl-popover-textarea" id="cs-hl-popover-text" placeholder="${t.popoverPlaceholder}"></textarea>
      <div class="cs-hl-popover-actions">
        <button class="cs-hl-btn cs-hl-btn-danger" id="cs-hl-popover-delete">${t.delete}</button>
        <button class="cs-hl-btn cs-hl-btn-primary" id="cs-hl-popover-save">${t.save}</button>
      </div>
    `;
    document.body.appendChild(this.popoverEl);
  }

  renderQuizModal() {
    const lang = this.getLang();
    const t = MODAL_I18N[lang];
    
    this.quizModalEl = document.createElement('div');
    this.quizModalEl.className = 'cs-quiz-modal-overlay';
    this.quizModalEl.innerHTML = `
      <div class="cs-quiz-modal">
        <div class="cs-quiz-modal-header">
          <h3>🎴 ${t.header}</h3>
          <button class="cs-quiz-modal-close">✕</button>
        </div>
        <div class="cs-quiz-modal-body">
          <div class="cs-quiz-modal-field">
            <label>${t.contextLabel}</label>
            <div class="cs-quiz-modal-context-val"></div>
          </div>
          <div class="cs-quiz-modal-field">
            <label>${t.answerLabel}</label>
            <div class="cs-quiz-modal-answer-val"></div>
          </div>
          <div class="cs-quiz-modal-field">
            <label>${t.questionLabel}</label>
            <textarea class="cs-quiz-modal-question-input" placeholder="${t.questionPlaceholder}"></textarea>
          </div>
          <div class="cs-quiz-modal-auto-btn-wrapper">
            <button class="cs-quiz-modal-auto-btn">${t.autoFillBtn}</button>
          </div>
        </div>
        <div class="cs-quiz-modal-footer">
          <button class="cs-quiz-modal-save-btn">${t.saveBtn}</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.quizModalEl);
  }

  openQuizModal() {
    const selection = window.getSelection();
    if (!selection) return;
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    this.currentSelectedTextForCard = selectedText;

    // Get surrounding block node to construct autofill
    let blockNode = null;
    if (selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).startContainer;
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentNode;
      }
      blockNode = node;
      while (blockNode && !['P', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TD'].includes(blockNode.tagName)) {
        blockNode = blockNode.parentNode;
      }
    }
    const fullText = blockNode ? blockNode.textContent.trim() : '';
    this.contextFullText = fullText;

    const lang = this.getLang();
    const urlParams = new URLSearchParams(window.location.search);
    const bookPath = urlParams.get('book') || '';
    const chapterId = urlParams.get('chapter') || 'chapter-01';

    const bookTitle = document.getElementById('book-title')?.textContent || '';
    const chapterEl = document.querySelector('#chapter-list .chapter-item.active') || document.querySelector('#chapter-list .chapter-item.subchapter.active');
    const chapterTitle = chapterEl ? chapterEl.textContent.trim().replace(/^↳\s*/, '') : '';
    const contextStr = bookTitle ? `${bookTitle} / ${chapterTitle || chapterId}` : (chapterTitle || chapterId);

    this.quizModalEl.querySelector('.cs-quiz-modal-context-val').textContent = contextStr;
    this.quizModalEl.querySelector('.cs-quiz-modal-answer-val').textContent = selectedText;
    
    const textInput = this.quizModalEl.querySelector('.cs-quiz-modal-question-input');
    textInput.value = '';

    this.quizModalEl.classList.add('is-visible');
    textInput.focus();
  }

  saveQuizCard() {
    const textInput = this.quizModalEl.querySelector('.cs-quiz-modal-question-input');
    const questionText = textInput.value.trim();
    const lang = this.getLang();
    const t = MODAL_I18N[lang];

    if (!questionText) {
      this.showToast(t.errorEmpty);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bookPath = urlParams.get('book') || '';
    const bookTitle = document.getElementById('book-title')?.textContent || '';
    const chapterId = urlParams.get('chapter') || 'chapter-01';
    const chapterEl = document.querySelector('#chapter-list .chapter-item.active') || document.querySelector('#chapter-list .chapter-item.subchapter.active');
    const chapterTitle = chapterEl ? chapterEl.textContent.trim().replace(/^↳\s*/, '') : '';

    const newCard = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      bookPath: bookPath,
      bookTitle: bookTitle,
      chapterId: chapterId,
      chapterTitle: chapterTitle,
      answer: this.currentSelectedTextForCard,
      question: questionText,
      created: Date.now()
    };

    let customCards = [];
    try {
      customCards = JSON.parse(localStorage.getItem('starley_custom_cards') || '[]');
    } catch (e) {
      customCards = [];
    }

    const isDuplicate = customCards.some(card => 
      card.answer === newCard.answer && card.question === newCard.question
    );

    if (isDuplicate) {
      this.showToast(t.duplicateMsg);
      return;
    }

    customCards.push(newCard);
    localStorage.setItem('starley_custom_cards', JSON.stringify(customCards));

    this.triggerHaptic();
    this.showToast(t.successMsg);
    this.quizModalEl.classList.remove('is-visible');

    // Clear selection
    try {
      window.getSelection().removeAllRanges();
    } catch (e) {}
  }

  showToast(message) {
    let toast = document.querySelector('.cs-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cs-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  triggerHaptic() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Ignore haptic errors
      }
    }
  }

  showToolbarAt(rect) {
    const toolbarWidth = 320;
    const toolbarHeight = 44;

    let top = window.scrollY + rect.top - toolbarHeight - 10;
    let left = window.scrollX + rect.left + (rect.width / 2) - (toolbarWidth / 2);

    // Mobile placement adjustment: position below selection if close to top of viewport
    if (rect.top - toolbarHeight - 10 < 60 || window.innerWidth < 768) {
      top = window.scrollY + rect.bottom + 12;
    }

    // Clamp horizontally to screen bounds
    left = Math.max(12, Math.min(window.innerWidth - toolbarWidth - 12, left));

    this.toolbarEl.style.top = `${top}px`;
    this.toolbarEl.style.left = `${left}px`;
    this.toolbarEl.classList.add('is-visible');
  }

  hideToolbar() {
    if (this.toolbarEl) {
      this.toolbarEl.classList.remove('is-visible');
    }
  }

  showPopoverAt(targetMark) {
    this.activeMarkId = targetMark.dataset.hlId;
    const rect = targetMark.getBoundingClientRect();
    const popoverWidth = 280;

    let top = window.scrollY + rect.bottom + 8;
    let left = window.scrollX + rect.left + (rect.width / 2) - (popoverWidth / 2);

    left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, left));

    const textInput = document.getElementById('cs-hl-popover-text');
    if (textInput) {
      textInput.value = targetMark.dataset.note || '';
    }

    this.popoverEl.style.top = `${top}px`;
    this.popoverEl.style.left = `${left}px`;
    this.popoverEl.classList.add('is-visible');
  }

  hidePopover() {
    if (this.popoverEl) {
      this.popoverEl.classList.remove('is-visible');
    }
    this.activeMarkId = null;
  }

  bindEvents() {
    const container = this.engine.container;

    // Selection change / Pointerup listener with 150ms debounce
    const handleSelectionCheck = () => {
      clearTimeout(this.selectionDebounce);
      this.selectionDebounce = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          this.hideToolbar();
          return;
        }

        const selectedText = selection.toString().trim();
        if (selectedText.length < 3) {
          this.hideToolbar();
          return;
        }

        // Avoid triggering toolbar if selecting inside popup or modal
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.closest('.cs-quiz-modal') || activeEl.closest('.cs-hl-popover'))) {
          return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        this.showToolbarAt(rect);
      }, 150);
    };

    container.addEventListener('pointerup', handleSelectionCheck);
    document.addEventListener('selectionchange', handleSelectionCheck);

    // Toolbar Click (Colors, Note input, Close, Add to Quiz)
    this.toolbarEl.addEventListener('click', async (e) => {
      const colorBtn = e.target.closest('.cs-hl-color-btn');
      if (colorBtn) {
        const color = colorBtn.dataset.color;
        const noteInput = document.getElementById('cs-hl-note-input');
        const noteText = noteInput ? noteInput.value.trim() : '';

        this.triggerHaptic();
        await this.engine.applyHighlight(color, noteText);

        if (noteInput) noteInput.value = '';
        this.hideToolbar();
        return;
      }

      const quizBtn = e.target.closest('#cs-hl-quiz-btn');
      if (quizBtn) {
        this.triggerHaptic();
        this.openQuizModal();
        this.hideToolbar();
        return;
      }

      if (e.target.closest('#cs-hl-close-btn')) {
        this.hideToolbar();
      }
    });

    // Handle Click on existing highlights
    container.addEventListener('click', (e) => {
      const mark = e.target.closest('mark.cs-highlight');
      if (mark && mark.dataset.hlId) {
        e.stopPropagation();
        this.triggerHaptic();
        this.showPopoverAt(mark);
      } else {
        this.hidePopover();
      }
    });

    // Popover Action Buttons
    this.popoverEl.addEventListener('click', async (e) => {
      if (!this.activeMarkId) return;

      if (e.target.closest('#cs-hl-popover-save')) {
        const textInput = document.getElementById('cs-hl-popover-text');
        const noteText = textInput ? textInput.value.trim() : '';
        this.triggerHaptic();
        await this.engine.updateNote(this.activeMarkId, noteText);
        this.hidePopover();
      } else if (e.target.closest('#cs-hl-popover-delete')) {
        this.triggerHaptic();
        await this.engine.removeHighlight(this.activeMarkId);
        this.hidePopover();
      } else if (e.target.closest('#cs-hl-popover-close')) {
        this.hidePopover();
      }
    });

    // Quiz Modal Buttons
    this.quizModalEl.querySelector('.cs-quiz-modal-close').addEventListener('click', () => {
      this.triggerHaptic();
      this.quizModalEl.classList.remove('is-visible');
    });

    this.quizModalEl.querySelector('.cs-quiz-modal-save-btn').addEventListener('click', () => {
      this.saveQuizCard();
    });

    this.quizModalEl.querySelector('.cs-quiz-modal-auto-btn').addEventListener('click', () => {
      this.triggerHaptic();
      const selected = this.currentSelectedTextForCard;
      const fullText = this.contextFullText;
      let questionValue = '';
      
      if (fullText && selected && fullText.includes(selected)) {
        questionValue = fullText.replace(selected, '[ ... ]');
      } else {
        questionValue = `Заполните пропуск: [ ... ]`;
      }
      
      const textInput = this.quizModalEl.querySelector('.cs-quiz-modal-question-input');
      textInput.value = questionValue;
      textInput.focus();
    });

    // Close on Escape key
    this.keyListener = (e) => {
      if (e.key === 'Escape') {
        this.hideToolbar();
        this.hidePopover();
        if (this.quizModalEl) {
          this.quizModalEl.classList.remove('is-visible');
        }
      }
    };
    document.addEventListener('keydown', this.keyListener);
  }

  destroy() {
    if (this.keyListener) document.removeEventListener('keydown', this.keyListener);
    if (this.toolbarEl) this.toolbarEl.remove();
    if (this.popoverEl) this.popoverEl.remove();
    if (this.quizModalEl) this.quizModalEl.remove();
  }
}

if (typeof window !== 'undefined') {
  window.HighlightToolbar = HighlightToolbar;
}

const I18N = {
  ru: {
    yellow: "Желтый - Важное",
    green: "Зеленый - Препараты/Дозировки",
    blue: "Синий - Протоколы",
    red: "Красный - Противопоказания",
    purple: "Фиолетовый - Запомнить",
    orange: "Оранжевый - Интересно",
    pink: "Розовый - Ничего себе",
    teal: "Бирюзовый - Техника",
    notePlaceholder: "Заметка...",
    close: "Закрыть",
    popoverHeader: "📝 Заметка к тексту",
    popoverPlaceholder: "Введите заметку...",
    delete: "🗑️ Удалить",
    save: "Сохранить",
    addToQuiz: "🎴 Добавить в Квиз"
  },
  en: {
    yellow: "Yellow - Important",
    green: "Green - Meds/Dosages",
    blue: "Blue - Protocols",
    red: "Red - Contraindications",
    purple: "Purple - Remember",
    orange: "Orange - Interesting",
    pink: "Pink - Wow!",
    teal: "Teal - Technique",
    notePlaceholder: "Note...",
    close: "Close",
    popoverHeader: "📝 Note to text",
    popoverPlaceholder: "Enter note...",
    delete: "🗑️ Delete",
    save: "Save",
    addToQuiz: "🎴 Add to Quiz"
  }
};

const MODAL_I18N = {
  ru: {
    header: "Карточка самопроверки",
    contextLabel: "Контекст (Глава)",
    answerLabel: "Ответ (Выделенный фрагмент)",
    questionLabel: "Вопрос или подсказка",
    questionPlaceholder: "Введите вопрос для самопроверки или используйте автозаполнение...",
    autoFillBtn: "✨ Заполнить пропуск: [ ... ]",
    saveBtn: "💾 Сохранить",
    successMsg: "🎴 Карточка успешно сохранена!",
    duplicateMsg: "⚠️ Такая карточка уже есть в базе!",
    errorEmpty: "Пожалуйста, введите вопрос или подсказку."
  },
  en: {
    header: "Active Recall Card",
    contextLabel: "Context (Chapter)",
    answerLabel: "Answer (Selected Text)",
    questionLabel: "Question or Hint",
    questionPlaceholder: "Enter a question/hint or autofill from context...",
    autoFillBtn: "✨ Fill-in-the-blank: [ ... ]",
    saveBtn: "💾 Save Card",
    successMsg: "🎴 Card saved successfully!",
    duplicateMsg: "⚠️ This card already exists!",
    errorEmpty: "Please enter a question or hint."
  }
};

