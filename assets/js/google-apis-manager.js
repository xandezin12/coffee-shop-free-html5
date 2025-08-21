/**
 * Google APIs Manager - Free APIs Integration
 * Integrates multiple Google APIs for enhanced coffee shop functionality
 */

class GoogleAPIsManager {
    constructor() {
        this.config = {
            // Replace with your actual API keys
            mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
            placesApiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
            analyticsId: 'G-XXXXXXXXXX',
            recaptchaKey: 'YOUR_RECAPTCHA_SITE_KEY'
        };
        
        this.map = null;
        this.userLocation = null;
        this.init();
    }

    async init() {
        await this.loadGoogleMaps();
        this.initializeRecaptcha();
        this.setupGeolocation();
        this.initPlacesAPI();
        this.setupTranslateAPI();
    }

    // 1. Google Maps API - Store Location & Directions
    async loadGoogleMaps() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.mapsApiKey}&libraries=places,geometry&callback=initMap`;
            script.async = true;
            
            window.initMap = () => {
                this.initMap();
                resolve();
            };
            
            document.head.appendChild(script);
        });
    }

    initMap() {
        const storeLocation = {
            lat: -23.54008690303477,
            lng: -46.652840763335085
        };

        this.map = new google.maps.Map(document.getElementById('mapa'), {
            zoom: 15,
            center: storeLocation,
            styles: [
                {
                    featureType: 'poi.business',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Store marker
        const storeMarker = new google.maps.Marker({
            position: storeLocation,
            map: this.map,
            title: 'Coffee Shop',
            icon: {
                url: 'assets/img/logo.png',
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h4>Coffee Shop</h4>
                    <p>R. Aureliano Coutinho, 26<br>
                    Consolação, São Paulo - SP</p>
                    <button onclick="googleAPIs.getDirections()" class="btn btn-primary btn-sm">
                        Como Chegar
                    </button>
                </div>
            `
        });

        storeMarker.addListener('click', () => {
            infoWindow.open(this.map, storeMarker);
        });
    }

    // 2. Geolocation & Directions
    setupGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.addUserMarker();
                },
                () => console.log('Geolocation not available')
            );
        }
    }

    addUserMarker() {
        if (this.userLocation && this.map) {
            new google.maps.Marker({
                position: this.userLocation,
                map: this.map,
                title: 'Sua Localização',
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
            });
        }
    }

    getDirections() {
        if (this.userLocation) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            
            directionsRenderer.setMap(this.map);
            
            directionsService.route({
                origin: this.userLocation,
                destination: { lat: -23.54008690303477, lng: -46.652840763335085 },
                travelMode: google.maps.TravelMode.DRIVING
            }, (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                }
            });
        } else {
            window.open(`https://maps.google.com/maps?daddr=-23.54008690303477,-46.652840763335085`, '_blank');
        }
    }

    // 3. Google Places API - Nearby Competitors & Reviews
    initPlacesAPI() {
        if (this.map) {
            const service = new google.maps.places.PlacesService(this.map);
            
            // Search for nearby coffee shops
            service.nearbySearch({
                location: { lat: -23.54008690303477, lng: -46.652840763335085 },
                radius: 1000,
                type: ['cafe']
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.displayNearbyPlaces(results.slice(0, 3));
                }
            });
        }
    }

    displayNearbyPlaces(places) {
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h5>Cafeterias Próximas</h5>
                ${places.map(place => `
                    <div style="margin: 10px 0; padding: 8px; border-left: 3px solid #E89A2F;">
                        <strong>${place.name}</strong><br>
                        <small>⭐ ${place.rating || 'N/A'} • ${place.vicinity}</small>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('contact').appendChild(container);
    }

    // 4. Google reCAPTCHA - Form Security
    initializeRecaptcha() {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.config.recaptchaKey}`;
        document.head.appendChild(script);
        
        // Add reCAPTCHA to forms
        this.addRecaptchaToForms();
    }

    addRecaptchaToForms() {
        const forms = ['#contact', '#eventForm', '#loginFormElement', '#registerFormElement'];
        
        forms.forEach(formSelector => {
            const form = document.querySelector(formSelector);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.executeRecaptcha(formSelector);
                });
            }
        });
    }

    executeRecaptcha(formSelector) {
        if (window.grecaptcha) {
            grecaptcha.ready(() => {
                grecaptcha.execute(this.config.recaptchaKey, { action: 'submit' })
                    .then((token) => {
                        this.submitFormWithToken(formSelector, token);
                    });
            });
        }
    }

    submitFormWithToken(formSelector, token) {
        const form = document.querySelector(formSelector);
        const formData = new FormData(form);
        formData.append('recaptcha_token', token);
        
        // Process form submission
        console.log('Form submitted with reCAPTCHA token:', token);
        this.showSuccess('Formulário enviado com segurança!');
    }

    // 5. Google Translate API (Client-side)
    setupTranslateAPI() {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(script);
        
        window.googleTranslateElementInit = () => {
            new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'en,es,fr,pt',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };
        
        // Add translate widget to navbar
        this.addTranslateWidget();
    }

    addTranslateWidget() {
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const translateLi = document.createElement('li');
            translateLi.innerHTML = `
                <div id="google_translate_element" style="margin-top: 8px;"></div>
            `;
            navbar.appendChild(translateLi);
        }
    }

    // 6. Google Fonts API - Enhanced Typography
    loadGoogleFonts() {
        const fonts = [
            'Roboto:300,400,500,700',
            'Open+Sans:300,400,600,700',
            'Poppins:300,400,500,600,700'
        ];
        
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}`).join('&')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // 7. YouTube API - Embed Coffee Making Videos
    loadYouTubeVideos() {
        const videoContainer = document.createElement('div');
        videoContainer.innerHTML = `
            <div style="margin: 40px 0; text-align: center;">
                <h3>Como Fazemos Nosso Café</h3>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                    <iframe 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.appendChild(videoContainer);
        }
    }

    // 8. Google Calendar API - Event Booking
    initCalendarAPI() {
        // Load Google Calendar API for event scheduling
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            gapi.load('client', () => {
                gapi.client.init({
                    apiKey: this.config.mapsApiKey,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
                });
            });
        };
        document.head.appendChild(script);
    }

    // Utility Methods
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        alert.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 15px; border-radius: 5px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
        
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    // Performance Monitoring
    trackAPIPerformance(apiName, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (window.gtag) {
            gtag('event', 'api_performance', {
                api_name: apiName,
                duration: Math.round(duration),
                custom_parameter: 'coffee_shop_apis'
            });
        }
    }
}

// Initialize Google APIs Manager
window.addEventListener('DOMContentLoaded', () => {
    window.googleAPIs = new GoogleAPIsManager();
});