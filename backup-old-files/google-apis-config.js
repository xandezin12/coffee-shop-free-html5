/**
 * Google APIs Configuration
 * Centralized configuration for all Google API integrations
 */

const GoogleAPIsConfig = {
    // API Keys (Replace with your actual keys)
    apiKeys: {
        maps: 'YOUR_GOOGLE_MAPS_API_KEY',
        places: 'YOUR_GOOGLE_PLACES_API_KEY', 
        recaptcha: 'YOUR_RECAPTCHA_SITE_KEY',
        youtube: 'YOUR_YOUTUBE_API_KEY',
        analytics: 'G-XXXXXXXXXX'
    },

    // Maps Configuration
    maps: {
        center: {
            lat: -23.54008690303477,
            lng: -46.652840763335085
        },
        zoom: 15,
        styles: [
            {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#f5f1e6' }]
            }
        ]
    },

    // Places API Configuration
    places: {
        searchRadius: 1000,
        types: ['cafe', 'restaurant', 'bakery'],
        maxResults: 5
    },

    // Fonts Configuration
    fonts: [
        'Roboto:300,400,500,700',
        'Open+Sans:300,400,600,700', 
        'Poppins:300,400,500,600,700',
        'Playfair+Display:400,700'
    ],

    // Translation Configuration
    translate: {
        pageLanguage: 'pt',
        includedLanguages: 'en,es,fr,pt,de,it',
        layout: 'SIMPLE'
    },

    // YouTube Configuration
    youtube: {
        channelId: 'YOUR_CHANNEL_ID',
        playlistId: 'YOUR_PLAYLIST_ID',
        maxResults: 3
    },

    // Calendar Configuration
    calendar: {
        calendarId: 'primary',
        timeZone: 'America/Sao_Paulo'
    },

    // Performance Monitoring
    performance: {
        enableTracking: true,
        sampleRate: 100
    }
};

// Make config globally available
window.GoogleAPIsConfig = GoogleAPIsConfig;

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAPIsConfig;
}