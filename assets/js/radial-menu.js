// assets/js/radial-menu.js
// Two-level Radial Menu module for Reader UI with Typography Submenu state machine

(function(window) {
    'use strict';

    const RadialMenu = {
        currentState: 'MAIN', // 'MAIN' | 'TYPOGRAPHY'
        R_SUB: 85, // radius in px for submenu items

        init() {
            const container = document.getElementById('radial-menu-container');
            if (!container) return;

            this.bindEvents();
            this.syncActivePresetUI();
        },

        bindEvents() {
            const container = document.getElementById('radial-menu-container');
            const subItems = document.querySelectorAll('.radial-item-sub');

            subItems.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const presetId = btn.dataset.preset;
                    if (presetId && window.TypographyManager) {
                        window.TypographyManager.setPreset(presetId);
                        this.syncActivePresetUI();
                    }
                    this.closeAll();
                });
            });
        },

        positionSubmenuItems() {
            const container = document.getElementById('radial-menu-container');
            if (!container) return;

            const items = container.querySelectorAll('.radial-item-sub');
            // Preset angles mapping: 45° (Modern), 135° (Academic), 225° (Technical), 315° (Accessibility)
            const angleMap = {
                'modern': 45,
                'academic': 135,
                'technical': 225,
                'accessibility': 315
            };

            items.forEach((item, index) => {
                const preset = item.dataset.preset;
                const angleDeg = angleMap[preset] !== undefined ? angleMap[preset] : (45 + index * 90);
                const angleRad = (angleDeg * Math.PI) / 180;

                const tx = Math.round(Math.cos(angleRad) * this.R_SUB);
                // Math.sin y-axis points down in CSS translateY
                const ty = Math.round(-Math.sin(angleRad) * this.R_SUB);
                const t = `translate(${tx}px, ${ty}px)`;

                item.style.setProperty('--sub-translate', t);
                item.style.transform = `${t} scale(1)`;
                item.style.transitionDelay = (index * 0.04) + 's';
            });
        },

        enterTypographyState() {
            const container = document.getElementById('radial-menu-container');
            const trigger = document.getElementById('radial-trigger');
            if (!container) return;

            this.currentState = 'TYPOGRAPHY';
            container.classList.add('state-typography');

            if (trigger) {
                const icon = trigger.querySelector('i');
                if (icon) icon.className = 'fas fa-arrow-left';
                trigger.setAttribute('title', 'Back to main menu');
            }

            this.positionSubmenuItems();
            this.syncActivePresetUI();
        },

        exitSubmenuState() {
            const container = document.getElementById('radial-menu-container');
            const trigger = document.getElementById('radial-trigger');
            if (!container) return;

            this.currentState = 'MAIN';
            container.classList.remove('state-typography');

            if (trigger) {
                const icon = trigger.querySelector('i');
                if (icon) icon.className = 'fas fa-sliders-h';
                trigger.setAttribute('title', 'Reader settings');
            }
        },

        syncActivePresetUI() {
            const currentPreset = (window.TypographyManager && window.TypographyManager.currentPreset) || 
                                  (window.ReaderSettingsManager && window.ReaderSettingsManager.getPreset()) || 'modern';
            
            document.querySelectorAll('.radial-item-sub').forEach(btn => {
                btn.classList.toggle('active-preset', btn.dataset.preset === currentPreset);
            });
        },

        closeAll() {
            const container = document.getElementById('radial-menu-container');
            if (container) {
                container.classList.remove('open');
                this.exitSubmenuState();
            }
            document.body.classList.remove('radial-open');
        }
    };

    window.RadialMenu = RadialMenu;

    document.addEventListener('DOMContentLoaded', () => {
        RadialMenu.init();
    });
})(window);
