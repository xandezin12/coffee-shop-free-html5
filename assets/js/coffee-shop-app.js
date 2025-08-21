/**
 * COFFEE SHOP - SISTEMA COMPLETO
 * Arquivo único com todas as funcionalidades organizadas
 */

// ===== CONFIGURAÇÃO =====
window.CoffeeShopApp = {
    // Configurações básicas
    config: {
        businessName: 'Coffee Shop Student Project',
        businessEmail: 'student@example.com',
        businessPhone: '+55 (11) 99999-9999',
        salt: 'student_project_salt_2024',
        
        // Google Cloud (configure suas credenciais)
        googleCloud: {
            apiKey: 'AIzaSyD2J13uAARWDU1HgIDeNNooVnAyr8KYoSI',
            projectId: 'decent-core-469718-t8',
            enableMaps: true,
            enableTranslate: true
        },
        
        // Recursos habilitados
        features: {
            userAuth: true,
            orderSystem: true,
            googleIntegration: true,
            multiLanguage: true
        }
    },

    // ===== SISTEMA DE SEGURANÇA =====
    security: {
        sanitizeInput(input) {
            if (typeof input !== 'string') return input;
            return input.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
        },

        escapeHtml(unsafe) {
            if (!unsafe) return '';
            return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        },

        async hashPassword(password) {
            const salt = this.config.salt;
            const encoder = new TextEncoder();
            const data = encoder.encode(password + salt);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },

        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        validatePassword(password) {
            return password && password.length >= 8 && 
                   /[A-Z]/.test(password) && /[a-z]/.test(password) && 
                   /\d/.test(password) && /[!@#$%^&*]/.test(password);
        }
    },

    // ===== SISTEMA DE USUÁRIOS =====
    auth: {
        currentUser: null,

        async register(userData) {
            try {
                // Validação
                if (!CoffeeShopApp.security.validateEmail(userData.email)) {
                    throw new Error('Email inválido');
                }
                if (!CoffeeShopApp.security.validatePassword(userData.password)) {
                    throw new Error('Senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo');
                }

                // Hash da senha
                const hashedPassword = await CoffeeShopApp.security.hashPassword(userData.password);
                
                // Salvar usuário
                const user = {
                    id: Date.now().toString(),
                    name: CoffeeShopApp.security.sanitizeInput(userData.name),
                    email: userData.email,
                    password: hashedPassword,
                    createdAt: new Date().toISOString()
                };

                localStorage.setItem('coffee_user', JSON.stringify(user));
                this.currentUser = { ...user };
                delete this.currentUser.password;

                this.updateUI();
                return { success: true, message: 'Cadastro realizado com sucesso!' };
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        async login(email, password) {
            try {
                const savedUser = JSON.parse(localStorage.getItem('coffee_user') || '{}');
                
                if (!savedUser.email || savedUser.email !== email) {
                    throw new Error('Usuário não encontrado');
                }

                const hashedPassword = await CoffeeShopApp.security.hashPassword(password);
                
                if (savedUser.password !== hashedPassword) {
                    throw new Error('Senha incorreta');
                }

                this.currentUser = { ...savedUser };
                delete this.currentUser.password;
                
                this.updateUI();
                return { success: true, message: `Bem-vindo, ${savedUser.name}!` };
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        logout() {
            this.currentUser = null;
            this.updateUI();
            CoffeeShopApp.ui.showMessage('Logout realizado com sucesso');
        },

        updateUI() {
            const loginBtn = document.getElementById('loginBtn');
            if (!loginBtn) return;

            if (this.currentUser) {
                const firstName = this.currentUser.name.split(' ')[0];
                loginBtn.innerHTML = `👤 ${firstName}`;
                loginBtn.onclick = () => CoffeeShopApp.ui.toggleProfile();
            } else {
                loginBtn.innerHTML = '👤 Login';
                loginBtn.onclick = () => CoffeeShopApp.ui.openModal('login');
            }
        },

        init() {
            // Carrega usuário salvo
            try {
                const savedUser = JSON.parse(localStorage.getItem('coffee_user') || '{}');
                if (savedUser.email) {
                    this.currentUser = savedUser;
                    delete this.currentUser.password;
                    this.updateUI();
                }
            } catch (error) {
                console.log('Nenhum usuário salvo');
            }
        }
    },

    // ===== SISTEMA DE APIS =====
    api: {
        async getCoffeeMenu() {
            // Menu simulado
            return {
                success: true,
                data: [
                    { id: 1, name: 'Espresso', price: 8.50, category: 'cafe' },
                    { id: 2, name: 'Cappuccino', price: 12.00, category: 'cafe' },
                    { id: 3, name: 'Chá Verde', price: 9.50, category: 'cha' },
                    { id: 4, name: 'Bolo de Chocolate', price: 15.00, category: 'doce' }
                ]
            };
        },

        async submitOrder(orderData) {
            try {
                const order = {
                    id: Date.now().toString(),
                    items: orderData.items,
                    total: orderData.total,
                    customerName: orderData.customerName || 'Cliente',
                    timestamp: new Date().toISOString()
                };

                // Salva pedido
                const orders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
                orders.push(order);
                localStorage.setItem('coffee_orders', JSON.stringify(orders));

                return { 
                    success: true, 
                    data: { orderId: order.id, message: 'Pedido realizado com sucesso!' }
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        async submitContact(formData) {
            try {
                const contact = {
                    id: Date.now().toString(),
                    name: CoffeeShopApp.security.sanitizeInput(formData.name),
                    email: formData.email,
                    message: CoffeeShopApp.security.sanitizeInput(formData.message),
                    timestamp: new Date().toISOString()
                };

                const contacts = JSON.parse(localStorage.getItem('coffee_contacts') || '[]');
                contacts.push(contact);
                localStorage.setItem('coffee_contacts', JSON.stringify(contacts));

                return { success: true, message: 'Mensagem enviada com sucesso!' };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    },

    // ===== GOOGLE CLOUD =====
    google: {
        async loadMap(elementId = 'mapa') {
            const config = CoffeeShopApp.config.googleCloud;
            if (!config.enableMaps || config.apiKey === 'SUA_API_KEY_AQUI') {
                console.log('Configure Google Cloud para usar mapas');
                return;
            }

            try {
                // Carrega Google Maps
                if (!window.google) {
                    await this.loadScript(`https://maps.googleapis.com/maps/api/js?key=${config.apiKey}`);
                }

                const mapElement = document.getElementById(elementId);
                if (!mapElement) return;

                const map = new google.maps.Map(mapElement, {
                    center: { lat: -23.5505, lng: -46.6333 },
                    zoom: 15
                });

                new google.maps.Marker({
                    position: { lat: -23.5505, lng: -46.6333 },
                    map: map,
                    title: 'Coffee Shop'
                });

                console.log('🗺️ Mapa carregado');
                return map;
            } catch (error) {
                console.error('Erro ao carregar mapa:', error);
            }
        },

        async translateText(text, targetLang = 'en') {
            const config = CoffeeShopApp.config.googleCloud;
            if (!config.enableTranslate || config.apiKey === 'SUA_API_KEY_AQUI') {
                return text;
            }

            try {
                const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${config.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        q: text,
                        target: targetLang,
                        source: 'pt'
                    })
                });

                const data = await response.json();
                return data.data?.translations?.[0]?.translatedText || text;
            } catch (error) {
                console.error('Erro na tradução:', error);
                return text;
            }
        },

        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    },

    // ===== INTERFACE DO USUÁRIO =====
    ui: {
        showMessage(message, type = 'success') {
            const messageEl = document.createElement('div');
            messageEl.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                padding: 15px 20px; border-radius: 5px; color: white; font-weight: bold;
                background: ${type === 'error' ? '#ff4757' : '#2ed573'};
            `;
            messageEl.textContent = message;
            document.body.appendChild(messageEl);

            setTimeout(() => messageEl.remove(), 3000);
        },

        openModal(type) {
            const modal = document.getElementById('authModal');
            if (!modal) this.createModal();
            
            document.getElementById('authModal').style.display = 'flex';
            this.showForm(type);
        },

        closeModal() {
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';
        },

        showForm(type) {
            const loginForm = document.getElementById('loginFormContainer');
            const registerForm = document.getElementById('registerFormContainer');
            
            if (type === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        },

        toggleProfile() {
            let profile = document.getElementById('userProfile');
            if (!profile) {
                profile = document.createElement('div');
                profile.id = 'userProfile';
                profile.style.cssText = `
                    position: fixed; top: 70px; right: 30px; background: white;
                    padding: 15px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1000; display: block;
                `;
                profile.innerHTML = `
                    <h5>${CoffeeShopApp.auth.currentUser?.name}</h5>
                    <p style="font-size: 12px; color: #666;">${CoffeeShopApp.auth.currentUser?.email}</p>
                    <button onclick="CoffeeShopApp.auth.logout()" class="btn btn-sm btn-secondary">Sair</button>
                `;
                document.body.appendChild(profile);
            } else {
                profile.style.display = profile.style.display === 'none' ? 'block' : 'none';
            }
        },

        createModal() {
            const modal = document.createElement('div');
            modal.id = 'authModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); display: none; justify-content: center;
                align-items: center; z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 400px;">
                    <button onclick="CoffeeShopApp.ui.closeModal()" style="float: right; border: none; background: none; font-size: 20px;">&times;</button>
                    
                    <div id="loginFormContainer">
                        <h3>Entrar</h3>
                        <form id="loginForm">
                            <input type="email" id="loginEmail" placeholder="Email" required style="width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <input type="password" id="loginPassword" placeholder="Senha" required style="width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <button type="submit" style="width: 100%; padding: 10px; background: #E89A2F; color: white; border: none; border-radius: 5px;">Entrar</button>
                        </form>
                        <p><a href="#" onclick="CoffeeShopApp.ui.showForm('register')">Não tem conta? Cadastre-se</a></p>
                    </div>
                    
                    <div id="registerFormContainer" style="display: none;">
                        <h3>Cadastrar</h3>
                        <form id="registerForm">
                            <input type="text" id="regName" placeholder="Nome completo" required style="width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <input type="email" id="regEmail" placeholder="Email" required style="width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <input type="password" id="regPassword" placeholder="Senha (8+ chars, A-z, 0-9, !@#)" required style="width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <button type="submit" style="width: 100%; padding: 10px; background: #E89A2F; color: white; border: none; border-radius: 5px;">Cadastrar</button>
                        </form>
                        <p><a href="#" onclick="CoffeeShopApp.ui.showForm('login')">Já tem conta? Entre</a></p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.bindModalEvents();
        },

        bindModalEvents() {
            // Login
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                const result = await CoffeeShopApp.auth.login(email, password);
                this.showMessage(result.message, result.success ? 'success' : 'error');
                
                if (result.success) this.closeModal();
            });

            // Register
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const userData = {
                    name: document.getElementById('regName').value,
                    email: document.getElementById('regEmail').value,
                    password: document.getElementById('regPassword').value
                };
                
                const result = await CoffeeShopApp.auth.register(userData);
                this.showMessage(result.message, result.success ? 'success' : 'error');
                
                if (result.success) this.closeModal();
            });
        }
    },

    // ===== INICIALIZAÇÃO =====
    init() {
        console.log('☕ Coffee Shop App iniciando...');
        
        // Inicializa sistemas
        this.auth.init();
        
        // Carrega mapa se disponível
        if (this.config.features.googleIntegration) {
            setTimeout(() => this.google.loadMap(), 1000);
        }
        
        // Bind eventos
        this.bindEvents();
        
        console.log('✅ Coffee Shop App pronto!');
    },

    bindEvents() {
        // Formulário de contato
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                };
                
                const result = await this.api.submitContact(formData);
                this.ui.showMessage(result.message || result.error, result.success ? 'success' : 'error');
                
                if (result.success) contactForm.reset();
            });
        }
    }
};

// ===== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE =====
window.openLogin = () => CoffeeShopApp.ui.openModal('login');
window.closeLogin = () => CoffeeShopApp.ui.closeModal();
window.logout = () => CoffeeShopApp.auth.logout();

// ===== FUNÇÕES PARA ESTUDANTES =====
window.testCoffeeShop = async () => {
    console.log('🧪 Testando Coffee Shop App...');
    
    // Testa menu
    const menu = await CoffeeShopApp.api.getCoffeeMenu();
    console.log('Menu:', menu);
    
    // Testa pedido
    const order = await CoffeeShopApp.api.submitOrder({
        items: [{ id: 1, name: 'Cappuccino', price: 12.00 }],
        total: 12.00,
        customerName: 'Teste'
    });
    console.log('Pedido:', order);
    
    // Testa Google (se configurado)
    if (CoffeeShopApp.config.googleCloud.apiKey !== 'SUA_API_KEY_AQUI') {
        await CoffeeShopApp.google.loadMap();
        const translated = await CoffeeShopApp.google.translateText('Olá mundo!', 'en');
        console.log('Tradução:', translated);
    }
    
    console.log('✅ Testes concluídos!');
};

window.getAppStatus = () => {
    return {
        user: CoffeeShopApp.auth.currentUser,
        config: CoffeeShopApp.config,
        orders: JSON.parse(localStorage.getItem('coffee_orders') || '[]'),
        contacts: JSON.parse(localStorage.getItem('coffee_contacts') || '[]')
    };
};

// ===== AUTO-INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    CoffeeShopApp.init();
});

console.log('☕ Coffee Shop - Sistema Completo Carregado!');