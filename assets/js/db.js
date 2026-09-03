/**
 * IndexedDB Wrapper for Highlights & Margin Notes
 * Starley Medical Library
 */

const DB_NAME = 'StarleyCSLibraryDB';
const DB_VERSION = 1;
const STORE_NAME = 'highlights';

export class HighlightsDB {
  static async getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('bookId', 'bookId', { unique: false });
          store.createIndex('chapterId', 'chapterId', { unique: false });
          store.createIndex('book_chapter', ['bookId', 'chapterId'], { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async saveHighlight(highlight) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(highlight);
      req.onsuccess = () => resolve(highlight);
      req.onerror = () => reject(req.error);
    });
  }

  static async getHighlights(bookId, chapterId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      if (bookId && chapterId) {
        const index = store.index('book_chapter');
        const req = index.getAll([bookId, chapterId]);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      } else {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      }
    });
  }

  static async getAll() {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  static async removeHighlight(id) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  static async updateNote(id, noteText) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);
      
      getReq.onsuccess = () => {
        const data = getReq.result;
        if (data) {
          data.note = noteText;
          data.updatedAt = Date.now();
          const putReq = store.put(data);
          putReq.onsuccess = () => resolve(data);
          putReq.onerror = () => reject(putReq.error);
        } else {
          reject(new Error(`Highlight with ID ${id} not found`));
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
}

// Make globally accessible if needed
if (typeof window !== 'undefined') {
  window.HighlightsDB = HighlightsDB;
}
