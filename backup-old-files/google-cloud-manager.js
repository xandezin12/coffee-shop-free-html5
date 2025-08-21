/**
 * Google Cloud API Manager - Integração Simples
 * Usa suas credenciais do Google Cloud
 */

class GoogleCloudManager {
    constructor() {
        this.config = window.googleCloudConfig;
        this.isReady = false;
        this.init();
    }

    init() {
        if (!this.config || !this.config.apiKey) {
            console.warn('⚠️ Google Cloud não configurado');
            return;
        }
        
        this.isReady = true;
        console.log('🌐 Google Cloud Manager inicializado');
    }

    // Google Maps - Mapa da cafeteria
    async loadMap(elementId = 'mapa') {
        if (!this.config.apis.maps) return;
        
        try {
            const mapElement = document.getElementById(elementId);
            if (!mapElement) return;

            // Carrega Google Maps API
            if (!window.google) {
                await this.loadGoogleMapsScript();
            }

            const map = new google.maps.Map(mapElement, {
                center: this.config.maps.center,
                zoom: this.config.maps.zoom,
                mapTypeId: this.config.maps.style
            });

            // Adiciona marcador da cafeteria
            const marker = new google.maps.Marker({
                position: this.config.maps.center,
                map: map,
                title: 'Coffee Shop',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="18" fill="#E89A2F" stroke="#fff" stroke-width="2"/>
                            <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">☕</text>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(40, 40)
                }
            });

            console.log('🗺️ Mapa carregado com sucesso');
            return map;
        } catch (error) {
            console.error('❌ Erro ao carregar mapa:', error);
        }
    }

    // Carrega script do Google Maps
    loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (window.google) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Falha ao carregar Google Maps'));
            
            document.head.appendChild(script);
        });
    }

    // Google Translate - Tradução automática
    async translateText(text, targetLang = 'en') {
        if (!this.config.apis.translate) return text;
        
        try {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${this.config.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLang,
                    source: 'pt'
                })
            });

            const data = await response.json();
            
            if (data.data && data.data.translations) {
                return data.data.translations[0].translatedText;
            }
            
            return text;
        } catch (error) {
            console.error('❌ Erro na tradução:', error);
            return text;
        }
    }

    // Google Places - Buscar lugares próximos
    async findNearbyPlaces(type = 'restaurant') {
        if (!this.config.apis.places) return [];
        
        try {
            const location = `${this.config.maps.center.lat},${this.config.maps.center.lng}`;
            const radius = 1000; // 1km
            
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${this.config.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results) {
                console.log(`📍 Encontrados ${data.results.length} lugares próximos`);
                return data.results.slice(0, 5); // Primeiros 5 resultados
            }
            
            return [];
        } catch (error) {
            console.error('❌ Erro ao buscar lugares:', error);
            return [];
        }
    }

    // Geocoding - Converter endereço em coordenadas
    async geocodeAddress(address) {
        if (!this.config.apis.geocoding) return null;
        
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.config.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                console.log(`📍 Endereço geocodificado: ${location.lat}, ${location.lng}`);
                return location;
            }
            
            return null;
        } catch (error) {
            console.error('❌ Erro no geocoding:', error);
            return null;
        }
    }

    // Função auxiliar - Calcular distância
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return Math.round(distance * 100) / 100; // Arredonda para 2 casas decimais
    }

    // Função para estudantes - Testar todas as APIs
    async testAllGoogleAPIs() {
        console.log('🧪 Testando Google Cloud APIs...');
        
        // Teste 1: Tradução
        if (this.config.apis.translate) {
            const translated = await this.translateText('Olá, bem-vindo!', 'en');
            console.log('🌐 Tradução:', translated);
        }
        
        // Teste 2: Geocoding
        if (this.config.apis.geocoding) {
            const coords = await this.geocodeAddress('Avenida Paulista, São Paulo');
            console.log('📍 Geocoding:', coords);
        }
        
        // Teste 3: Places
        if (this.config.apis.places) {
            const places = await this.findNearbyPlaces('cafe');
            console.log('☕ Cafés próximos:', places);
        }
        
        // Teste 4: Mapa
        if (this.config.apis.maps) {
            console.log('🗺️ Carregando mapa...');
            await this.loadMap();
        }
        
        console.log('✅ Testes do Google Cloud concluídos!');
    }
}

// Inicializar Google Cloud Manager
const googleCloud = new GoogleCloudManager();

// Tornar disponível globalmente
window.googleCloud = googleCloud;

// Funções auxiliares para estudantes
window.loadGoogleMap = () => googleCloud.loadMap();
window.translateToEnglish = (text) => googleCloud.translateText(text, 'en');
window.findNearbyCafes = () => googleCloud.findNearbyPlaces('cafe');
window.testGoogleAPIs = () => googleCloud.testAllGoogleAPIs();

console.log('🌐 Google Cloud Manager carregado! Use testGoogleAPIs() para testar.');