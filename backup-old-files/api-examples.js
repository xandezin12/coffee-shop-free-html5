/**
 * Exemplo de uso das APIs - Para Estudantes
 * Como usar o sistema de APIs de forma simples
 */

// Aguarda o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de APIs carregado!');
    
    // Exemplo 1: Carregar menu do café
    loadMenuExample();
    
    // Exemplo 2: Simular pedido
    setupOrderExample();
    
    // Exemplo 3: Formulário de contato
    setupContactExample();
    
    // Exemplo 4: Widget do tempo
    setupWeatherWidget();
});

// Exemplo 1: Carregar menu
async function loadMenuExample() {
    try {
        console.log('📋 Carregando menu...');
        const menu = await apiManager.getCoffeeMenu();
        
        if (menu.success) {
            console.log('✅ Menu carregado:', menu.data);
            // Aqui você pode atualizar a interface com os dados do menu
            displayMenuItems(menu.data);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar menu:', error);
    }
}

// Função para exibir itens do menu
function displayMenuItems(items) {
    // Exemplo simples de como exibir os itens
    items.forEach(item => {
        console.log(`☕ ${item.name} - R$ ${item.price.toFixed(2)}`);
    });
}

// Exemplo 2: Sistema de pedidos
function setupOrderExample() {
    // Adiciona listener para botões de pedido (se existirem)
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('order-btn')) {
            const orderData = {
                items: [
                    {
                        id: 1,
                        name: 'Cappuccino',
                        quantity: 1,
                        price: 3.50
                    }
                ],
                total: 3.50,
                customerName: authSystem.getCurrentUser()?.name || 'Cliente'
            };
            
            const result = await apiManager.submitOrder(orderData);
            
            if (result.success) {
                alert(`✅ Pedido realizado! ID: ${result.data.orderId}`);
                console.log('Pedido:', result.data);
            } else {
                alert(`❌ Erro no pedido: ${result.error}`);
            }
        }
    });
}

// Exemplo 3: Formulário de contato
function setupContactExample() {
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            console.log('📧 Enviando mensagem de contato...');
            const result = await apiManager.submitContact(formData);
            
            if (result.success) {
                alert('✅ Mensagem enviada com sucesso!');
                contactForm.reset();
            } else {
                alert(`❌ Erro: ${result.error}`);
            }
        });
    }
}

// Exemplo 4: Widget do tempo
async function setupWeatherWidget() {
    try {
        const weather = await apiManager.getWeather('São Paulo');
        
        if (weather.success) {
            console.log('🌤️ Clima atual:', weather.data);
            
            // Cria um widget simples do tempo
            const weatherWidget = document.createElement('div');
            weatherWidget.innerHTML = `
                <div style="position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 1000;">
                    🌤️ ${weather.data.name}: ${weather.data.main.temp}°C
                    <br>
                    ${weather.data.weather[0].description}
                </div>
            `;
            
            document.body.appendChild(weatherWidget);
            
            // Remove o widget após 10 segundos
            setTimeout(() => {
                weatherWidget.remove();
            }, 10000);
        }
    } catch (error) {
        console.log('ℹ️ Widget do tempo não disponível');
    }
}

// Funções auxiliares para estudantes

// Função para testar todas as APIs
window.testAllAPIs = async function() {
    console.log('🧪 Testando todas as APIs...');
    
    // Teste 1: Menu
    const menu = await apiManager.getCoffeeMenu();
    console.log('Menu:', menu);
    
    // Teste 2: Posts (exemplo)
    const posts = await apiManager.getPosts();
    console.log('Posts:', posts);
    
    // Teste 3: Usuários (exemplo)
    const users = await apiManager.getUsers();
    console.log('Users:', users);
    
    // Teste 4: Pedidos do usuário
    const orders = await apiManager.getUserOrders();
    console.log('Orders:', orders);
    
    console.log('✅ Testes concluídos!');
};

// Função para limpar dados de teste
window.clearTestData = function() {
    localStorage.removeItem('coffee_orders');
    localStorage.removeItem('coffee_contacts');
    apiManager.clearCache();
    console.log('🧹 Dados de teste limpos!');
};

// Função para ver status do sistema
window.getSystemStatus = function() {
    const status = {
        user: authSystem.getCurrentUser(),
        cache: apiManager.getCacheStatus(),
        config: window.coffeeShopConfig
    };
    
    console.log('📊 Status do Sistema:', status);
    return status;
};

console.log('📚 Exemplos de API carregados! Use testAllAPIs() para testar tudo.');