# 🌐 Como Configurar Google Cloud - Guia Rápido

## 📋 Passo a Passo

### 1. **Obter API Key**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique **Create Credentials** → **API Key**
5. Copie sua API Key

### 2. **Habilitar APIs Necessárias**
No Google Cloud Console, vá em **APIs & Services** → **Library** e habilite:

- ✅ **Maps JavaScript API** (para mapas)
- ✅ **Places API** (para buscar lugares)
- ✅ **Geocoding API** (para endereços)
- ✅ **Cloud Translation API** (para tradução)

### 3. **Configurar no Projeto**
Edite o arquivo `config/google-cloud-config.js`:

```javascript
window.googleCloudConfig = {
    // Cole sua API Key aqui
    apiKey: 'AIzaSyBvOkBjcWb4CebxhChzqSWYjYk_wrtKiWM', // Exemplo
    projectId: 'meu-coffee-shop-123', // Seu Project ID
    
    // Marque true para as APIs que quer usar
    apis: {
        maps: true,      // Mapa da cafeteria
        translate: true, // Tradução automática
        places: true,    // Lugares próximos
        geocoding: true  // Converter endereços
    }
};
```

## 🚀 Como Usar

### **Mapa da Cafeteria**
```javascript
// Carrega mapa automaticamente no elemento #mapa
loadGoogleMap();
```

### **Tradução Automática**
```javascript
// Traduz texto para inglês
const translated = await translateToEnglish('Bem-vindo ao nosso café!');
console.log(translated); // "Welcome to our cafe!"
```

### **Buscar Cafés Próximos**
```javascript
// Encontra cafés na região
const cafes = await findNearbyCafes();
console.log(cafes); // Lista de cafés próximos
```

### **Testar Tudo**
```javascript
// No console do navegador (F12)
testGoogleAPIs(); // Testa todas as APIs configuradas
```

## 💡 Funcionalidades Implementadas

### 🗺️ **Mapa Interativo**
- Mostra localização da cafeteria
- Marcador personalizado com ícone de café
- Integração automática com o site

### 🌐 **Tradução Automática**
- Traduz conteúdo para outros idiomas
- Suporte a português, inglês, espanhol, francês
- Integração com sistema de idiomas existente

### 📍 **Lugares Próximos**
- Encontra cafés e restaurantes na região
- Calcula distâncias
- Mostra informações úteis

### 🎯 **Geocoding**
- Converte endereços em coordenadas
- Útil para delivery e localização
- Validação de endereços

## 🔒 Segurança

### **Restrições Recomendadas**
No Google Cloud Console → **Credentials** → sua API Key:

1. **Application restrictions**: HTTP referrers
2. **Website restrictions**: `seu-dominio.com/*`
3. **API restrictions**: Selecione apenas as APIs que usa

### **Exemplo de Restrição**
```
https://meusite.com/*
https://localhost:*
http://127.0.0.1:*
```

## 🧪 Testando

### **Console do Navegador (F12)**
```javascript
// Testa todas as APIs
testGoogleAPIs()

// Testa individualmente
loadGoogleMap()                    // Carrega mapa
translateToEnglish('Olá mundo!')  // Traduz texto
findNearbyCafes()                  // Busca cafés
```

### **Verificar Configuração**
```javascript
// Mostra status das APIs
console.log(window.googleCloudConfig)
```

## 💰 Custos (Gratuito para Estudantes)

### **Cota Gratuita Mensal**
- **Maps**: 28.000 carregamentos
- **Places**: 17.000 requisições  
- **Geocoding**: 40.000 requisições
- **Translate**: 500.000 caracteres

### **Para Estudantes**
- Use o [Google for Education](https://edu.google.com/) para créditos gratuitos
- Monitore uso no Cloud Console
- Configure alertas de billing

## 🆘 Problemas Comuns

### **API Key não funciona**
- ✅ Verifique se as APIs estão habilitadas
- ✅ Confirme as restrições de domínio
- ✅ Aguarde alguns minutos após criar

### **Mapa não carrega**
- ✅ Verifique console (F12) por erros
- ✅ Confirme que Maps JavaScript API está habilitada
- ✅ Teste com `loadGoogleMap()`

### **Tradução falha**
- ✅ Habilite Cloud Translation API
- ✅ Verifique cota disponível
- ✅ Teste com `translateToEnglish('teste')`

---

**🎓 Perfeito para projetos estudantis!**