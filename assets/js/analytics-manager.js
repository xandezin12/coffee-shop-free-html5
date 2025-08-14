/**
 * Google Analytics Manager
 * Minimal implementation for tracking user interactions
 */

class AnalyticsManager {
    constructor() {
        this.trackingId = '12021413278'; // Replace with your actual GA4 Measurement ID
        this.init();
    }

    init() {
        this.loadGoogleAnalytics();
        this.setupEventTracking();
    }

    loadGoogleAnalytics() {
        // Load Google Analytics 4
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script1);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.trackingId);
        
        // Make gtag globally available
        window.gtag = gtag;
    }

    setupEventTracking() {
        // Track menu interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-tab')) {
                this.trackEvent('menu_category_view', {
                    category: e.target.dataset.category
                });
            }
            
            // Track cart actions
            if (e.target.textContent.includes('Adicionar')) {
                const menuItem = e.target.closest('.menu-item');
                const itemName = menuItem?.querySelector('h4')?.textContent;
                this.trackEvent('add_to_cart', {
                    item_name: itemName,
                    currency: 'BRL'
                });
            }
            
            // Track event form opens
            if (e.target.dataset.event) {
                this.trackEvent('event_form_open', {
                    event_type: e.target.dataset.event
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'eventForm') {
                this.trackEvent('event_form_submit', {
                    event_type: document.getElementById('eventType')?.textContent
                });
            }
            
            if (e.target.id === 'contact') {
                this.trackEvent('contact_form_submit');
            }
        });
    }

    trackEvent(eventName, parameters = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }
    }

    trackPageView(pagePath) {
        if (window.gtag) {
            window.gtag('config', this.trackingId, {
                page_path: pagePath
            });
        }
    }
}

// Initialize Analytics
const analyticsManager = new AnalyticsManager();
window.analyticsManager = analyticsManager;