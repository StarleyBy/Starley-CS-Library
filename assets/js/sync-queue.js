/**
 * assets/js/sync-queue.js
 * Автономная очередь повторных попыток (Offline Retry Queue)
 * Starley Medical Library
 *
 * Буферизует отложенные сетевые операции при сбоях связи (в подземных отделениях/клиниках),
 * сохраняет состояние в localStorage ('cs_offline_sync_queue') и автоматически
 * сбрасывает накопившиеся данные при восстановлении соединения (событие 'online').
 */

class OfflineSyncManager {
  constructor(clientProvider = null) {
    this.storageKey = 'cs_offline_sync_queue';
    this.clientProvider = clientProvider;
    this.queue = [];
    this.isFlushing = false;
    this.load();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[OfflineSyncManager] Network online detected, flushing queue...');
        this.flush();
      });

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && (typeof navigator === 'undefined' || navigator.onLine)) {
            this.flush();
          }
        });
      }
    }
  }

  getClient() {
    if (this.clientProvider) {
      return typeof this.clientProvider === 'function' ? this.clientProvider() : this.clientProvider;
    }
    if (typeof window !== 'undefined') {
      if (window.SupabaseAPI && window.SupabaseAPI.client) return window.SupabaseAPI.client;
      if (window.supabaseClient) return window.supabaseClient;
    }
    return null;
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) this.queue = parsed;
        }
      }
    } catch (e) {
      console.warn('[OfflineSyncManager] Failed to load offline queue:', e);
    }
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
      }
    } catch (e) {
      console.warn('[OfflineSyncManager] Failed to persist offline queue:', e);
    }
  }

  enqueue(table, operation, payload, options = {}) {
    const item = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 9),
      table,
      operation,
      payload,
      options,
      retries: 0,
      createdAt: new Date().toISOString()
    };

    this.queue.push(item);
    this.save();
    console.log(`[OfflineSyncManager] Enqueued ${operation} for ${table || 'rpc'}:`, item.id);

    if (typeof navigator === 'undefined' || navigator.onLine) {
      this.flush();
    }

    return item;
  }

  isNetworkError(error) {
    if (!error) return false;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    const msg = String(error.message || error).toLowerCase();
    return msg.includes('network') ||
           msg.includes('fetch') ||
           msg.includes('offline') ||
           msg.includes('failed to fetch') ||
           msg.includes('timeout') ||
           msg.includes('abort') ||
           error.status === 0 ||
           error.status === 502 ||
           error.status === 503 ||
           error.status === 504;
  }

  async flush() {
    if (this.isFlushing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (!this.queue || this.queue.length === 0) return;

    const client = this.getClient();
    if (!client) {
      console.warn('[OfflineSyncManager] Supabase client not ready, deferring flush');
      return;
    }

    this.isFlushing = true;
    const items = [...this.queue];

    for (const item of items) {
      try {
        let result = null;

        if (item.operation === 'upsert') {
          const opt = item.options?.onConflict ? { onConflict: item.options.onConflict } : undefined;
          result = await client.from(item.table).upsert(item.payload, opt);
        } else if (item.operation === 'delete') {
          let query = client.from(item.table).delete();
          for (const [k, v] of Object.entries(item.payload)) {
            query = query.eq(k, v);
          }
          result = await query;
        } else if (item.operation === 'insert') {
          result = await client.from(item.table).insert(item.payload);
        } else if (item.operation === 'rpc') {
          result = await client.rpc(item.payload.fnName, item.payload.params);
        }

        if (result && result.error) {
          if (this.isNetworkError(result.error)) {
            console.warn('[OfflineSyncManager] Flush deferred due to network error:', result.error.message);
            break; // Прерываем до следующего восстановления соединения
          }

          // Несетевая ошибка: инкрементируем попытки
          item.retries = (item.retries || 0) + 1;
          if (item.retries >= 5) {
            console.warn('[OfflineSyncManager] Dropping failed item after max retries:', item.id, result.error.message);
            this.queue = this.queue.filter(q => q.id !== item.id);
            this.save();
          }
        } else {
          // Успешно выполнено: удаляем из очереди
          this.queue = this.queue.filter(q => q.id !== item.id);
          this.save();
        }
      } catch (err) {
        if (this.isNetworkError(err)) {
          console.warn('[OfflineSyncManager] Network exception during flush, deferring:', err.message);
          break;
        }

        item.retries = (item.retries || 0) + 1;
        if (item.retries >= 5) {
          console.warn('[OfflineSyncManager] Dropping failed item after exceptions:', item.id);
          this.queue = this.queue.filter(q => q.id !== item.id);
          this.save();
        }
      }
    }

    this.isFlushing = false;
  }

  getQueue() {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
    this.save();
  }
}

const syncManager = new OfflineSyncManager();

// UMD / Global Export for browser script tags
if (typeof window !== 'undefined') {
  window.OfflineSyncManager = OfflineSyncManager;
  window.syncManager = syncManager;
}

// ES Module Export
if (typeof exports !== 'undefined') {
  exports.OfflineSyncManager = OfflineSyncManager;
  exports.syncManager = syncManager;
}
