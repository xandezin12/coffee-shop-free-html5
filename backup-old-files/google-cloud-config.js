/**
 * Google Cloud Configuration - Para Estudantes
 * Configure suas credenciais do Google Cloud aqui
 */

window.googleCloudConfig = {
    // Suas credenciais do Google Cloud
    apiKey: 'SUA_API_KEY_AQUI', // Substitua pela sua API Key
    projectId: 'SEU_PROJECT_ID_AQUI', // Substitua pelo seu Project ID
    
    // APIs habilitadas (marque true para usar)
    apis: {
        maps: true,           // Google Maps API
        translate: true,      // Google Translate API
        places: true,         // Google Places API
        geocoding: true,      // Geocoding API
        analytics: false      // Google Analytics (opcional)
    },
    
    // Configurações específicas
    maps: {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
        zoom: 15,
        style: 'roadmap' // roadmap, satellite, hybrid, terrain
    },
    
    // Idiomas suportados para tradução
    languages: ['pt', 'en', 'es', 'fr'],
    
    // Configurações de segurança
    security: {
        restrictToOrigin: true, // Restringe ao seu domínio
        enableCORS: true
    }
};

// Função para validar configuração
function validateGoogleConfig() {
    const config = window.googleCloudConfig;
    
    if (!config.apiKey || config.apiKey === 'SUA_API_KEY_AQUI') {
        console.warn('⚠️ Configure sua API Key do Google Cloud em google-cloud-config.js');
        return false;
    }
    
    if (!config.projectId || config.projectId === 'SEU_PROJECT_ID_AQUI') {
        console.warn('⚠️ Configure seu Project ID do Google Cloud em google-cloud-config.js');
        return false;
    }
    
    console.log('✅ Configuração do Google Cloud válida');
    return true;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (validateGoogleConfig()) {
        console.log('🌐 Google Cloud APIs prontas para uso!');
    }
});

console.log('📋 Google Cloud Config carregado. Configure suas credenciais!');