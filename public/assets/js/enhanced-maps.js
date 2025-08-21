/**
 * Enhanced Google Maps Integration
 * Advanced mapping features for coffee shop
 */

class EnhancedMaps {
    constructor() {
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.userLocation = null;
        this.storeLocation = { lat: -23.54008690303477, lng: -46.652840763335085 };
        this.init();
    }

    async init() {
        await this.loadMapsAPI();
        this.initializeMap();
        this.setupGeolocation();
        this.addDeliveryZones();
        this.initStreetView();
    }

    async loadMapsAPI() {
        return new Promise((resolve) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GoogleAPIsConfig.apiKeys.maps}&libraries=places,geometry,visualization&callback=initEnhancedMaps`;
            script.async = true;
            
            window.initEnhancedMaps = () => {
                resolve();
            };
            
            document.head.appendChild(script);
        });
    }

    initializeMap() {
        const mapElement = document.getElementById('mapa');
        if (!mapElement) return;

        this.map = new google.maps.Map(mapElement, {
            zoom: GoogleAPIsConfig.maps.zoom,
            center: this.storeLocation,
            styles: GoogleAPIsConfig.maps.styles,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            draggable: true,
            panel: document.getElementById('directionsPanel')
        });
        this.directionsRenderer.setMap(this.map);

        this.addStoreMarker();
        this.addMapControls();
    }

    addStoreMarker() {
        const marker = new google.maps.Marker({
            position: this.storeLocation,
            map: this.map,
            title: 'Coffee Shop',
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#E89A2F" stroke="#fff" stroke-width="2"/>
                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">☕</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: this.createInfoWindowContent()
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        // Auto-open info window
        setTimeout(() => {
            infoWindow.open(this.map, marker);
        }, 1000);
    }

    createInfoWindowContent() {
        return `
            <div style="padding: 15px; max-width: 300px;">
                <h4 style="margin: 0 0 10px 0; color: #E89A2F;">☕ Coffee Shop</h4>
                <p style="margin: 5px 0;"><strong>📍 Endereço:</strong><br>
                R. Aureliano Coutinho, 26<br>
                Consolação, São Paulo - SP</p>
                
                <p style="margin: 5px 0;"><strong>📞 Telefone:</strong><br>
                (11) 99999-9999</p>
                
                <p style="margin: 5px 0;"><strong>🕒 Horário:</strong><br>
                Seg-Sex: 7h às 22h<br>
                Sáb-Dom: 8h às 21h</p>
                
                <div style="margin-top: 15px;">
                    <button onclick="enhancedMaps.getDirections()" 
                            class="btn btn-primary btn-sm" style="margin-right: 5px;">
                        🗺️ Como Chegar
                    </button>
                    <button onclick="enhancedMaps.openStreetView()" 
                            class="btn btn-secondary btn-sm">
                        👁️ Street View
                    </button>
                </div>
                
                <div style="margin-top: 10px;">
                    <button onclick="enhancedMaps.checkDelivery()" 
                            class="btn btn-success btn-sm">
                        🚚 Verificar Entrega
                    </button>
                </div>
            </div>
        `;
    }

    setupGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.addUserMarker();
                    this.calculateDistance();
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    this.showLocationPrompt();
                }
            );
        }
    }

    addUserMarker() {
        if (!this.userLocation) return;

        new google.maps.Marker({
            position: this.userLocation,
            map: this.map,
            title: 'Sua Localização',
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });

        // Adjust map to show both locations
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.userLocation);
        bounds.extend(this.storeLocation);
        this.map.fitBounds(bounds);
    }

    getDirections() {
        if (!this.userLocation) {
            this.showLocationPrompt();
            return;
        }

        const request = {
            origin: this.userLocation,
            destination: this.storeLocation,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        };

        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.directionsRenderer.setDirections(result);
                this.showDirectionsInfo(result);
            } else {
                this.openExternalMaps();
            }
        });
    }

    showDirectionsInfo(result) {
        const route = result.routes[0];
        const leg = route.legs[0];
        
        const info = `
            <div style="position: fixed; top: 100px; right: 20px; background: white; 
                        padding: 15px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
                        z-index: 1000; max-width: 250px;">
                <h5>🗺️ Rota para Coffee Shop</h5>
                <p><strong>Distância:</strong> ${leg.distance.text}</p>
                <p><strong>Tempo:</strong> ${leg.duration.text}</p>
                <button onclick="this.parentElement.remove()" class="btn btn-sm btn-secondary">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', info);
    }

    addDeliveryZones() {
        // Delivery zone circle (3km radius)
        const deliveryZone = new google.maps.Circle({
            strokeColor: '#E89A2F',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#E89A2F',
            fillOpacity: 0.15,
            map: this.map,
            center: this.storeLocation,
            radius: 3000 // 3km
        });

        // Premium delivery zone (1.5km radius)
        const premiumZone = new google.maps.Circle({
            strokeColor: '#28a745',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#28a745',
            fillOpacity: 0.2,
            map: this.map,
            center: this.storeLocation,
            radius: 1500 // 1.5km
        });
    }

    checkDelivery() {
        if (!this.userLocation) {
            this.showLocationPrompt();
            return;
        }

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng),
            new google.maps.LatLng(this.storeLocation.lat, this.storeLocation.lng)
        );

        const distanceKm = (distance / 1000).toFixed(1);
        let deliveryInfo = '';

        if (distance <= 1500) {
            deliveryInfo = `
                <div class="alert alert-success">
                    ✅ <strong>Entrega Grátis!</strong><br>
                    Você está a ${distanceKm}km da loja.<br>
                    Tempo estimado: 15-25 min
                </div>
            `;
        } else if (distance <= 3000) {
            deliveryInfo = `
                <div class="alert alert-warning">
                    🚚 <strong>Entrega Disponível</strong><br>
                    Você está a ${distanceKm}km da loja.<br>
                    Taxa: R$ 5,00 | Tempo: 25-40 min
                </div>
            `;
        } else {
            deliveryInfo = `
                <div class="alert alert-danger">
                    ❌ <strong>Fora da área de entrega</strong><br>
                    Você está a ${distanceKm}km da loja.<br>
                    Visite nossa loja física!
                </div>
            `;
        }

        this.showModal('Verificação de Entrega', deliveryInfo);
    }

    openStreetView() {
        const panorama = new google.maps.StreetViewPanorama(
            document.getElementById('streetViewModal') || this.createStreetViewModal(),
            {
                position: this.storeLocation,
                pov: { heading: 34, pitch: 10 }
            }
        );
        
        this.map.setStreetView(panorama);
    }

    createStreetViewModal() {
        const modal = document.createElement('div');
        modal.id = 'streetViewModal';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 80%; height: 60%; background: white; border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute; top: 10px; right: 15px; background: none;
            border: none; font-size: 24px; cursor: pointer; z-index: 10000;
        `;
        closeBtn.onclick = () => modal.remove();
        
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
        
        return modal;
    }

    calculateDistance() {
        if (!this.userLocation) return;

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng),
            new google.maps.LatLng(this.storeLocation.lat, this.storeLocation.lng)
        );

        const distanceKm = (distance / 1000).toFixed(1);
        
        // Add distance info to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const distanceInfo = document.createElement('div');
            distanceInfo.innerHTML = `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h5>📍 Distância da sua localização</h5>
                    <p><strong>${distanceKm} km</strong> da Coffee Shop</p>
                    <button onclick="enhancedMaps.getDirections()" class="btn btn-primary btn-sm">
                        Ver Rota
                    </button>
                </div>
            `;
            contactSection.appendChild(distanceInfo);
        }
    }

    addMapControls() {
        // Custom control for delivery check
        const deliveryControl = document.createElement('div');
        deliveryControl.innerHTML = `
            <button onclick="enhancedMaps.checkDelivery()" 
                    style="background: #E89A2F; color: white; border: none; 
                           padding: 10px 15px; border-radius: 5px; margin: 10px;">
                🚚 Verificar Entrega
            </button>
        `;
        
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(deliveryControl);
    }

    showLocationPrompt() {
        this.showModal('Localização Necessária', `
            <p>Para calcular rotas e verificar entrega, precisamos da sua localização.</p>
            <button onclick="enhancedMaps.requestLocation()" class="btn btn-primary">
                Permitir Localização
            </button>
            <button onclick="enhancedMaps.openExternalMaps()" class="btn btn-secondary">
                Abrir no Google Maps
            </button>
        `);
    }

    requestLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.addUserMarker();
                this.calculateDistance();
                document.querySelector('.modal-backdrop')?.remove();
            },
            () => this.openExternalMaps()
        );
    }

    openExternalMaps() {
        const url = `https://maps.google.com/maps?daddr=${this.storeLocation.lat},${this.storeLocation.lng}`;
        window.open(url, '_blank');
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-content" style="position: fixed; top: 50%; left: 50%; 
                 transform: translate(-50%, -50%); background: white; padding: 20px; 
                 border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
                 z-index: 9999; max-width: 400px;">
                <h4>${title}</h4>
                ${content}
                <button onclick="this.closest('.modal-backdrop').remove()" 
                        class="btn btn-secondary" style="margin-top: 15px;">
                    Fechar
                </button>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9998;
        `;
        
        document.body.appendChild(modal);
    }
}

// Initialize Enhanced Maps
window.addEventListener('DOMContentLoaded', () => {
    window.enhancedMaps = new EnhancedMaps();
});