import { HighlightsDB } from './db.js';

const I18N_EXPORTER = {
  ru: {
    noHighlights: 'Нет сохраненных закладок для экспорта',
    mainTitle: 'Starley Medical Library - Выделения и Заметки',
    generatedOn: 'Сформировано',
    book: 'Книга',
    chapter: 'Глава',
    note: 'Заметка',
    createdOn: 'Дата создания',
    categories: {
      yellow: '🟡 Важное',
      green: '🟢 Дозировки / Схемы',
      blue: '🔵 Протоколы / Литература',
      red: '🔴 Противопоказания / Риски'
    }
  },
  en: {
    noHighlights: 'No highlights saved to export',
    mainTitle: 'Starley Medical Library - Highlights & Notes',
    generatedOn: 'Generated on',
    book: 'Book',
    chapter: 'Chapter',
    note: 'Note',
    createdOn: 'Created on',
    categories: {
      yellow: '🟡 Important',
      green: '🟢 Meds / Dosages',
      blue: '🔵 Protocols',
      red: '🔴 Contraindications'
    }
  }
};

/**
 * Quick Export Module for Highlights & Notes (.md / .json)
 * Starley Medical Library
 */
export class HighlightsExporter {
  static getLang() {
    if (typeof document !== 'undefined') {
      return document.documentElement.lang === 'ru' ? 'ru' : 'en';
    }
    return 'en';
  }

  static async exportToMarkdown() {
    const lang = this.getLang();
    const t = I18N_EXPORTER[lang];
    const highlights = await HighlightsDB.getAll();
    if (!highlights || highlights.length === 0) {
      alert(t.noHighlights);
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    let mdContent = `# ${t.mainTitle}\n\n`;
    mdContent += `*${t.generatedOn}: ${new Date().toLocaleString()}*\n\n---\n\n`;

    const grouped = {};
    highlights.forEach(hl => {
      const bookLbl = hl.bookId || t.book;
      const chapterLbl = hl.chapterId || t.chapter;
      const key = `${bookLbl} / ${chapterLbl}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(hl);
    });

    for (const [location, items] of Object.entries(grouped)) {
      mdContent += `## 📚 ${location}\n\n`;
      items.forEach((item, idx) => {
        const catLabel = t.categories[item.color] || '🟡';
        mdContent += `### ${idx + 1}. [${catLabel}]\n\n`;
        mdContent += `> ${item.selectedText}\n\n`;
        if (item.note) {
          mdContent += `**📝 ${t.note}:** ${item.note}\n\n`;
        }
        mdContent += `*${t.createdOn}: ${new Date(item.createdAt).toLocaleString()}*\n\n---\n\n`;
      });
    }

    this.downloadFile(mdContent, `starley_highlights_${dateStr}.md`, 'text/markdown;charset=utf-8');
  }

  static async exportToJSON() {
    const lang = this.getLang();
    const t = I18N_EXPORTER[lang];
    const highlights = await HighlightsDB.getAll();
    if (!highlights || highlights.length === 0) {
      alert(t.noHighlights);
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const jsonContent = JSON.stringify(highlights, null, 2);
    this.downloadFile(jsonContent, `starley_highlights_backup_${dateStr}.json`, 'application/json;charset=utf-8');
  }

  static downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

if (typeof window !== 'undefined') {
  window.HighlightsExporter = HighlightsExporter;
}
