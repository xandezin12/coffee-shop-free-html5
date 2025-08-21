/**
 * Social Login Configuration
 * Configure suas credenciais de login social aqui
 */

window.SocialConfig = {
    google: {
        // Substitua pelo seu Google Client ID
        // Obtenha em: https://console.developers.google.com/
        clientId: 'SEU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com',
        
        // Configurações opcionais
        scopes: 'profile email',
        
        // Para desenvolvimento local, adicione http://localhost:3000 nas origens autorizadas
        enabled: false // Mude para true após configurar o clientId
    },
    
    facebook: {
        // Substitua pelo seu Facebook App ID
        // Obtenha em: https://developers.facebook.com/
        appId: 'SEU_FACEBOOK_APP_ID_AQUI',
        
        // Configurações opcionais
        version: 'v18.0',
        
        enabled: false // Mude para true após configurar o appId
    }
};

// Instruções de configuração
console.log(`
🔧 CONFIGURAÇÃO DE LOGIN SOCIAL

Para habilitar o login com Google:
1. Acesse: https://console.developers.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione seu domínio nas origens autorizadas
6. Substitua 'SEU_GOOGLE_CLIENT_ID_AQUI' pelo seu Client ID
7. Mude 'enabled: true' na configuração do Google

Para habilitar o login com Facebook:
1. Acesse: https://developers.facebook.com/
2. Crie um novo app
3. Configure o Facebook Login
4. Adicione seu domínio nos domínios válidos
5. Substitua 'SEU_FACEBOOK_APP_ID_AQUI' pelo seu App ID
6. Mude 'enabled: true' na configuração do Facebook
`);