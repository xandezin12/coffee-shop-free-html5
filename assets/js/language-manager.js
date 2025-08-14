/**
 * Language Manager System
 * Handles internationalization and language switching
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'pt'; // Default to Portuguese
        this.supportedLanguages = ['pt', 'en', 'es', 'fr'];
        this.translations = {};
        this.init();
    }

    init() {
        this.loadLanguageFromStorage();
        this.bindEvents();
        // Delay language selector creation to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createLanguageSelector();
            });
        } else {
            this.createLanguageSelector();
        }
    }

    loadLanguageFromStorage() {
        try {
            const savedLang = localStorage.getItem('coffeeShop_language');
            if (savedLang && this.supportedLanguages.includes(savedLang)) {
                this.currentLanguage = savedLang;
            }
        } catch (error) {
            console.warn('Could not load language from storage:', error);
        }
    }

    saveLanguageToStorage() {
        try {
            localStorage.setItem('coffeeShop_language', this.currentLanguage);
        } catch (error) {
            console.warn('Could not save language to storage:', error);
        }
    }

    createLanguageSelector() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        const languageSelector = document.createElement('li');
        languageSelector.className = 'language-selector';
        languageSelector.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" onclick="languageManager.toggleLanguageMenu()">
                    🌐 ${this.currentLanguage.toUpperCase()}
                </button>
                <div class="language-menu" id="languageMenu" style="display: none;">
                    <a href="#" onclick="languageManager.switchLanguage('pt')">🇧🇷 Português</a>
                    <a href="#" onclick="languageManager.switchLanguage('en')">🇺🇸 English</a>
                    <a href="#" onclick="languageManager.switchLanguage('es')">🇪🇸 Español</a>
                    <a href="#" onclick="languageManager.switchLanguage('fr')">🇫🇷 Français</a>
                </div>
            </div>
        `;

        navbar.insertBefore(languageSelector, navbar.lastElementChild);
        this.addLanguageSelectorStyles();
    }

    addLanguageSelectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .language-selector {
                position: relative;
            }
            .language-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 15px 10px;
                font-size: 14px;
            }
            .language-btn:hover {
                color: #E89A2F;
            }
            .language-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                z-index: 1000;
                min-width: 150px;
            }
            .language-menu a {
                display: block;
                padding: 10px 15px;
                color: #333;
                text-decoration: none;
                border-bottom: 1px solid #eee;
            }
            .language-menu a:hover {
                background: #f5f5f5;
                color: #E89A2F;
            }
            .language-menu a:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }

    toggleLanguageMenu() {
        const menu = document.getElementById('languageMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    bindEvents() {
        // Close language menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('languageMenu');
            const btn = document.querySelector('.language-btn');
            if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        });
    }

    async switchLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            console.warn('Unsupported language:', langCode);
            return;
        }

        try {
            // Load language file if not already loaded
            if (!window.Languages || !window.Languages[langCode]) {
                await this.loadLanguageFile(langCode);
            }

            this.currentLanguage = langCode;
            this.saveLanguageToStorage();
            this.updatePageContent();
            this.updateLanguageButton();
            
            // Close menu safely
            const menu = document.getElementById('languageMenu');
            if (menu) {
                menu.style.display = 'none';
            }
            
            this.showMessage(`Language changed to ${this.getLanguageName(langCode)}`);
        } catch (error) {
            console.error('Error switching language:', error);
            this.showMessage('Error changing language. Please try again.', 'error');
        }
    }

    async loadLanguageFile(langCode) {
        return new Promise((resolve, reject) => {
            // Check if language is already loaded
            if (window.Languages && window.Languages[langCode]) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = `languages/${langCode}.js`;
            script.onload = () => {
                // Verify the language was actually loaded
                if (window.Languages && window.Languages[langCode]) {
                    resolve();
                } else {
                    reject(new Error(`Language ${langCode} failed to load properly`));
                }
            };
            script.onerror = () => reject(new Error(`Failed to load language file: ${langCode}.js`));
            document.head.appendChild(script);
        });
    }

    updatePageContent() {
        const lang = window.Languages[this.currentLanguage];
        if (!lang) return;

        // Update navigation
        this.updateElement('[href="#home-section"]', lang.nav.welcome);
        this.updateElement('[href="#services"]', lang.nav.services);
        this.updateElement('[href="#menu"]', lang.nav.menu);
        this.updateElement('[href="#about"]', lang.nav.about);
        this.updateElement('[href="#portfolio"]', lang.nav.special);
        this.updateElement('[href="#events"]', lang.nav.events);
        this.updateElement('[href="#team"]', lang.nav.team);
        this.updateElement('[href="#contact"]', lang.nav.contact);

        // Update header
        this.updateElement('#headerwrap h1', lang.header.title);
        this.updateElement('#headerwrap p', lang.header.subtitle);
        this.updateElement('#headerwrap .btn', lang.header.cta);

        // Update services section
        this.updateElement('#services h2', lang.services.title);
        this.updateElement('#services .large', lang.services.subtitle);
        
        const serviceItems = document.querySelectorAll('#services .callout');
        if (serviceItems.length >= 3) {
            serviceItems[0].querySelector('h3').textContent = lang.services.coffee.title;
            serviceItems[0].querySelector('p').textContent = lang.services.coffee.description;
            serviceItems[1].querySelector('h3').textContent = lang.services.tea.title;
            serviceItems[1].querySelector('p').textContent = lang.services.tea.description;
            serviceItems[2].querySelector('h3').textContent = lang.services.cakes.title;
            serviceItems[2].querySelector('p').textContent = lang.services.cakes.description;
        }

        this.updateElement('.hero-section p', lang.services.highlight);
        this.updateElement('.reservation-btn', lang.services.cta);

        // Update menu section
        this.updateElement('#menu h2', lang.menu.title);
        this.updateElement('#menu .large', lang.menu.subtitle);

        // Update menu tabs
        const menuTabs = document.querySelectorAll('.menu-tab');
        if (menuTabs.length >= 3) {
            menuTabs[0].textContent = lang.menu.categories.cafes;
            menuTabs[1].textContent = lang.menu.categories.chas;
            menuTabs[2].textContent = lang.menu.categories.doces;
        }

        // Update about section
        this.updateElement('#about h2', lang.about.title);
        const aboutSection = document.querySelector('#about .col-md-6:last-child');
        if (aboutSection) {
            const h3Elements = aboutSection.querySelectorAll('h3');
            const pElements = aboutSection.querySelectorAll('p');
            if (h3Elements.length >= 2 && pElements.length >= 2) {
                h3Elements[0].textContent = lang.about.who_we_are;
                pElements[0].textContent = lang.about.who_description;
                h3Elements[1].textContent = lang.about.why_choose;
                pElements[1].textContent = lang.about.why_description;
            }
        }

        // Update team section
        this.updateElement('#team h2', lang.team.title);
        this.updateElement('#team .col-lg-8 p', lang.team.subtitle);

        // Update events section
        this.updateElement('#events h2', lang.events.title);
        this.updateElement('#events .large', lang.events.subtitle);

        // Update contact section
        this.updateElement('#contact h2', lang.contact.title);
        this.updateElement('#contact strong', lang.contact.subtitle);
        this.updateElement('#contact p', lang.contact.description);

        // Update form placeholders
        this.updatePlaceholder('#name', lang.contact.form.name);
        this.updatePlaceholder('#email', lang.contact.form.email);
        this.updatePlaceholder('#message', lang.contact.form.message);
        this.updateElement('#contact .btn', lang.contact.form.submit);

        // Update contact info
        this.updateElement('.contact-info h4', lang.contact.info_title);
    }

    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    updatePlaceholder(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.placeholder = text;
        }
    }

    updateLanguageButton() {
        const btn = document.querySelector('.language-btn');
        if (btn) {
            btn.textContent = `🌐 ${this.currentLanguage.toUpperCase()}`;
        }
    }

    getLanguageName(langCode) {
        const names = {
            'pt': 'Português',
            'en': 'English',
            'es': 'Español',
            'fr': 'Français'
        };
        return names[langCode] || langCode;
    }

    showMessage(message, type = 'success') {
        let messageEl = document.getElementById('langMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'langMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#ff4757' : '#2ed573';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key) {
        const lang = window.Languages[this.currentLanguage];
        if (!lang) return key;

        const keys = key.split('.');
        let value = lang;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value || key;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Make globally available
window.languageManager = languageManager;