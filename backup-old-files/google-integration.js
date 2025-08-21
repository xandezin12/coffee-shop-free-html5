/**
 * Integração Prática - Google Cloud + Coffee Shop
 * Exemplos reais de uso das APIs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que tudo carregou
    setTimeout(initGoogleIntegration, 1000);
});

async function initGoogleIntegration() {
    console.log('🌐 Iniciando integração Google Cloud...');
    
    // 1. Carrega mapa automaticamente
    await loadMapWithCoffeeShop();
    
    // 2. Adiciona tradução automática aos botões
    setupAutoTranslation();
    
    // 3. Busca cafés próximos
    await findNearbyCoffeeShops();
    
    // 4. Adiciona geocoding ao formulário de contato
    setupAddressGeocoding();
}

// 1. Mapa da cafeteria com informações
async function loadMapWithCoffeeShop() {
    try {
        const map = await googleCloud.loadMap('mapa');
        
        if (map) {
            // Adiciona informações da cafeteria
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h4>☕ Coffee Shop</h4>
                        <p>📍 R. Aureliano Coutinho, 26<br>
                        Consolação, São Paulo - SP</p>
                        <p>📞 (11) 99999-9999</p>
                        <p>⭐ Avaliação: 4.8/5</p>
                        <button onclick="window.open('tel:1199999999')" 
                                style="background: #E89A2F; color: white; border: none; padding: 5px 10px; border-radius: 3px;">
                            📞 Ligar Agora
                        </button>
                    </div>
                `
            });

            // Mostra info ao clicar no marcador
            const marker = map.data.markers?.[0];
            if (marker) {
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }
            
            console.log('🗺️ Mapa carregado com informações da cafeteria');
        }
    } catch (error) {
        console.log('ℹ️ Mapa não disponível - configure Google Cloud');
    }
}

// 2. Tradução automática para botões de idioma
function setupAutoTranslation() {
    // Adiciona botões de tradução rápida
    const navbar = document.querySelector('.navbar-nav');
    if (navbar && googleCloud.config?.apis?.translate) {
        
        const translateBtn = document.createElement('li');
        translateBtn.innerHTML = `
            <div class="dropdown" style="display: inline-block;">
                <button class="btn btn-sm btn-secondary dropdown-toggle" 
                        style="margin: 8px 5px;" 
                        onclick="toggleTranslateMenu()">
                    🌐 Traduzir
                </button>
                <div id="translateMenu" style="display: none; position: absolute; background: white; border: 1px solid #ccc; border-radius: 5px; padding: 10px; z-index: 1000;">
                    <button onclick="translatePage('en')" class="btn btn-sm">🇺🇸 English</button><br>
                    <button onclick="translatePage('es')" class="btn btn-sm">🇪🇸 Español</button><br>
                    <button onclick="translatePage('fr')" class="btn btn-sm">🇫🇷 Français</button><br>
                    <button onclick="translatePage('pt')" class="btn btn-sm">🇧🇷 Português</button>
                </div>
            </div>
        `;
        
        navbar.appendChild(translateBtn);
    }
}

// Função para alternar menu de tradução
window.toggleTranslateMenu = function() {
    const menu = document.getElementById('translateMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
};

// Função para traduzir página
window.translatePage = async function(targetLang) {
    if (targetLang === 'pt') {
        location.reload(); // Volta ao português original
        return;
    }
    
    console.log(`🌐 Traduzindo para ${targetLang}...`);
    
    // Elementos para traduzir
    const elementsToTranslate = [
        'h1', 'h2', 'h3', 'h4', 'p', 'button', 'a'
    ];
    
    for (const selector of elementsToTranslate) {
        const elements = document.querySelectorAll(selector);
        
        for (const element of elements) {
            if (element.textContent.trim() && element.textContent.length > 2) {
                try {
                    const translated = await googleCloud.translateText(element.textContent, targetLang);
                    if (translated && translated !== element.textContent) {
                        element.textContent = translated;
                    }
                } catch (error) {
                    // Ignora erros de tradução individual
                }
            }
        }
    }
    
    // Fecha menu
    document.getElementById('translateMenu').style.display = 'none';
    console.log('✅ Tradução concluída!');
};

// 3. Buscar cafés próximos e mostrar
async function findNearbyCoffeeShops() {
    try {
        const places = await googleCloud.findNearbyPlaces('cafe');
        
        if (places && places.length > 0) {
            // Adiciona seção de cafés próximos
            const nearbySection = document.createElement('div');
            nearbySection.innerHTML = `
                <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px;">
                    <h4>☕ Outros Cafés na Região</h4>
                    <div id="nearbyPlaces"></div>
                </div>
            `;
            
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.parentNode.insertBefore(nearbySection, contactSection);
                
                const placesContainer = document.getElementById('nearbyPlaces');
                places.slice(0, 3).forEach(place => {
                    const placeDiv = document.createElement('div');
                    placeDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: white; border-radius: 5px;';
                    placeDiv.innerHTML = `
                        <strong>${place.name}</strong><br>
                        <small>⭐ ${place.rating || 'N/A'} • ${place.vicinity}</small>
                    `;
                    placesContainer.appendChild(placeDiv);
                });
            }
            
            console.log('📍 Cafés próximos adicionados ao site');
        }
    } catch (error) {
        console.log('ℹ️ Busca de lugares não disponível');
    }
}

// 4. Geocoding para validar endereços
function setupAddressGeocoding() {
    const addressInput = document.getElementById('regAddress');
    
    if (addressInput && googleCloud.config?.apis?.geocoding) {
        let timeout;
        
        addressInput.addEventListener('input', function() {
            clearTimeout(timeout);
            
            timeout = setTimeout(async () => {
                const address = this.value;
                
                if (address.length > 10) {
                    try {
                        const coords = await googleCloud.geocodeAddress(address + ', São Paulo, SP');
                        
                        if (coords) {
                            // Adiciona ícone de validação
                            this.style.borderColor = '#28a745';
                            this.title = `✅ Endereço válido (${coords.lat}, ${coords.lng})`;
                            
                            // Calcula distância da cafeteria
                            const distance = googleCloud.calculateDistance(
                                googleCloud.config.maps.center.lat,
                                googleCloud.config.maps.center.lng,
                                coords.lat,
                                coords.lng
                            );
                            
                            console.log(`📍 Distância da cafeteria: ${distance} km`);
                        } else {
                            this.style.borderColor = '#dc3545';
                            this.title = '❌ Endereço não encontrado';
                        }
                    } catch (error) {
                        console.log('ℹ️ Geocoding não disponível');
                    }
                }
            }, 1000);
        });
    }
}

// Função para estudantes testarem tudo
window.testGoogleIntegration = async function() {
    console.log('🧪 Testando integração completa...');
    
    // Testa APIs básicas
    await googleCloud.testAllGoogleAPIs();
    
    // Testa integração específica
    console.log('🗺️ Testando mapa integrado...');
    await loadMapWithCoffeeShop();
    
    console.log('🌐 Testando tradução...');
    const translated = await googleCloud.translateText('Bem-vindo ao nosso café!', 'en');
    console.log('Tradução:', translated);
    
    console.log('📍 Testando geocoding...');
    const coords = await googleCloud.geocodeAddress('Avenida Paulista, 1000, São Paulo');
    console.log('Coordenadas:', coords);
    
    console.log('✅ Teste de integração concluído!');
};

console.log('🌐 Integração Google Cloud pronta! Use testGoogleIntegration() para testar tudo.');