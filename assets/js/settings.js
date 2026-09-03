// assets/js/settings.js
// Global settings manager for reader preferences & pre-render state application

(function() {
    // Early preset boot to eliminate FOUT/CLS on initial page load
    try {
        const rawPreset = localStorage.getItem('reader_typography_preset');
        let presetId = 'modern';
        if (rawPreset) {
            try { presetId = JSON.parse(rawPreset); }
            catch { presetId = rawPreset; }
        }
        document.documentElement.setAttribute('data-typography-preset', presetId);
        if (document.body) {
            document.body.setAttribute('data-typography-preset', presetId);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.setAttribute('data-typography-preset', presetId);
                const container = document.getElementById('main-content') || document.querySelector('.reader-layout');
                if (container) container.setAttribute('data-typography-preset', presetId);
            });
        }
    } catch (e) {
        console.warn('Early typography preset application failed:', e);
    }
})();

// Global ReaderSettings interface extension if not already present
window.ReaderSettingsManager = {
    PRESET_KEY: 'reader_typography_preset',
    
    getPreset() {
        try {
            const raw = localStorage.getItem(this.PRESET_KEY);
            return raw ? JSON.parse(raw) : 'modern';
        } catch {
            return 'modern';
        }
    },

    savePreset(presetId) {
        try {
            localStorage.setItem(this.PRESET_KEY, JSON.stringify(presetId));
        } catch (e) {
            console.error('Failed to save preset to localStorage:', e);
        }
    }
};
