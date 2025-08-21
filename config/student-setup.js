/**
 * STUDENT SETUP - Quick Google APIs Configuration
 * Replace YOUR_API_KEY with actual keys from Google Cloud Console
 */

// 1. REPLACE THESE WITH YOUR ACTUAL API KEYS
const STUDENT_CONFIG = {
    // Get from: console.cloud.google.com
    GOOGLE_MAPS_KEY: 'YOUR_API_KEY_HERE',
    
    // Get from: www.google.com/recaptcha/admin (choose v3)
    RECAPTCHA_KEY: 'YOUR_RECAPTCHA_KEY_HERE',
    
    // Get from: analytics.google.com
    ANALYTICS_ID: 'G-XXXXXXXXXX'
};

// 2. AUTO-SETUP (Don't change this)
window.addEventListener('DOMContentLoaded', () => {
    // Load Google Maps
    if (STUDENT_CONFIG.GOOGLE_MAPS_KEY !== 'YOUR_API_KEY_HERE') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${STUDENT_CONFIG.GOOGLE_MAPS_KEY}&libraries=places&callback=initStudentMap`;
        document.head.appendChild(script);
        
        window.initStudentMap = () => {
            const map = new google.maps.Map(document.getElementById('mapa'), {
                zoom: 15,
                center: { lat: -23.54008690303477, lng: -46.652840763335085 }
            });
            
            new google.maps.Marker({
                position: { lat: -23.54008690303477, lng: -46.652840763335085 },
                map: map,
                title: 'Coffee Shop'
            });
            
            console.log('✅ Google Maps loaded successfully!');
        };
    }
    
    // Load Analytics
    if (STUDENT_CONFIG.ANALYTICS_ID !== 'G-XXXXXXXXXX') {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${STUDENT_CONFIG.ANALYTICS_ID}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', STUDENT_CONFIG.ANALYTICS_ID);
        
        console.log('✅ Google Analytics loaded successfully!');
    }
    
    // Load reCAPTCHA
    if (STUDENT_CONFIG.RECAPTCHA_KEY !== 'YOUR_RECAPTCHA_KEY_HERE') {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${STUDENT_CONFIG.RECAPTCHA_KEY}`;
        document.head.appendChild(script);
        
        console.log('✅ reCAPTCHA loaded successfully!');
    }
});

// 3. SIMPLE FUNCTIONS YOU CAN USE
window.studentAPI = {
    // Track events
    trackEvent: (eventName) => {
        if (window.gtag) {
            gtag('event', eventName);
            console.log(`📊 Tracked: ${eventName}`);
        }
    },
    
    // Get user location
    getUserLocation: () => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('📍 User location:', position.coords);
        });
    },
    
    // Verify form with reCAPTCHA
    verifyForm: (formId) => {
        if (window.grecaptcha) {
            grecaptcha.ready(() => {
                grecaptcha.execute(STUDENT_CONFIG.RECAPTCHA_KEY, {action: 'submit'})
                    .then((token) => {
                        console.log('🔒 Form verified:', token);
                    });
            });
        }
    }
};