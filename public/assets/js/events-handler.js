// Sistema Centralizado de Eventos
document.addEventListener('DOMContentLoaded', function() {
    
    // Estado global
    let currentUser = null;
    
    // Elementos
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        loginModal: document.getElementById('loginModal'),
        closeLoginBtn: document.getElementById('closeLoginBtn'),
        loginForm: document.getElementById('loginFormElement'),
        registerForm: document.getElementById('registerFormElement'),
        showRegisterLink: document.getElementById('showRegisterLink'),
        showLoginLink: document.getElementById('showLoginLink'),
        logoutBtn: document.getElementById('logoutBtn'),
        userProfile: document.getElementById('userProfile'),
        languageBtn: document.getElementById('languageBtn'),
        languageModal: document.getElementById('languageModal'),
        closeLanguageBtn: document.getElementById('closeLanguageBtn')
    };
    
    // Event Delegation - Um listener para tudo
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    
    async function handleClick(e) {
        const target = e.target;
        const closest = target.closest.bind(target);
        
        // Login Button
        if (target.id === 'loginBtn' || closest('#loginBtn')) {
            e.preventDefault();
            if (currentUser) {
                toggleProfile();
            } else {
                openModal('loginModal');
            }
        }
        
        // Close Modals
        if (target.id === 'closeLoginBtn' || closest('#closeLoginBtn')) {
            closeModal('loginModal');
        }
        if (target.id === 'closeLanguageBtn' || closest('#closeLanguageBtn')) {
            closeModal('languageModal');
        }
        
        // Language Button
        if (target.id === 'languageBtn' || closest('#languageBtn')) {
            openModal('languageModal');
        }
        
        // Switch Forms
        if (target.id === 'showRegisterLink') {
            e.preventDefault();
            switchForm('register');
        }
        if (target.id === 'showLoginLink') {
            e.preventDefault();
            switchForm('login');
        }
        
        // Social Login
        if (closest('.google-btn')) {
            e.preventDefault();
            await handleGoogleLogin();
        }
        
        // Logout
        if (target.id === 'logoutBtn' || closest('#logoutBtn')) {
            e.preventDefault();
            await handleLogout();
        }
        
        // Language Selection
        if (closest('.language-option')) {
            const lang = target.dataset.lang;
            if (lang) {
                changeLanguage(lang);
                closeModal('languageModal');
            }
        }
        
        // Event Buttons
        if (closest('[data-event]')) {
            const eventType = target.dataset.event;
            openEventModal(eventType);
        }
        
        // Staff Contact
        if (closest('[data-staff]')) {
            const staff = target.dataset.staff;
            const phone = target.dataset.phone;
            contactStaff(staff, phone);
        }
        
        // Close modal on backdrop click
        if (target.classList.contains('login-modal') || target.classList.contains('language-modal')) {
            closeModal(target.id);
        }
    }
    
    async function handleSubmit(e) {
        const form = e.target;
        
        if (form.id === 'loginFormElement') {
            e.preventDefault();
            await handleLogin(form);
        }
        
        if (form.id === 'registerFormElement') {
            e.preventDefault();
            await handleRegister(form);
        }
        
        if (form.id === 'contactForm') {
            e.preventDefault();
            handleContact(form);
        }
        
        if (form.id === 'eventForm') {
            e.preventDefault();
            handleEventForm(form);
        }
    }
    
    // Modal Functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }
    
    function switchForm(type) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (type === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }
    
    function toggleProfile() {
        if (elements.userProfile) {
            const isVisible = elements.userProfile.style.display === 'block';
            elements.userProfile.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    // Auth Functions
    async function handleLogin(form) {
        const email = form.querySelector('#loginEmail').value;
        const password = form.querySelector('#loginPassword').value;
        
        if (!email || !password) {
            showMessage('Preencha todos os campos', 'error');
            return;
        }
        
        try {
            if (window.firebaseAuth) {
                const result = await window.firebaseAuth.loginWithEmail(email, password);
                if (result.success) {
                    showMessage('Login realizado com sucesso!');
                    closeModal('loginModal');
                } else {
                    showMessage(result.error, 'error');
                }
            } else {
                showMessage('Firebase não carregado', 'error');
            }
        } catch (error) {
            showMessage('Erro: ' + error.message, 'error');
        }
    }
    
    async function handleRegister(form) {
        const name = form.querySelector('#regName').value;
        const email = form.querySelector('#regEmail').value;
        const password = form.querySelector('#regPassword').value;
        const phone = form.querySelector('#regPhone').value;
        const address = form.querySelector('#regAddress').value;
        
        if (!name || !email || !password) {
            showMessage('Preencha os campos obrigatórios', 'error');
            return;
        }
        
        try {
            if (window.firebaseAuth) {
                const result = await window.firebaseAuth.registerWithEmail(email, password, {
                    name, email, phone, address
                });
                if (result.success) {
                    showMessage('Conta criada com sucesso!');
                    closeModal('loginModal');
                } else {
                    showMessage(result.error, 'error');
                }
            } else {
                showMessage('Firebase não carregado', 'error');
            }
        } catch (error) {
            showMessage('Erro: ' + error.message, 'error');
        }
    }
    
    async function handleGoogleLogin() {
        try {
            if (window.firebaseAuth) {
                const result = await window.firebaseAuth.loginWithGoogle();
                if (result.success) {
                    showMessage('Login com Google realizado!');
                    closeModal('loginModal');
                } else {
                    showMessage(result.error, 'error');
                }
            } else {
                showMessage('Firebase não carregado', 'error');
            }
        } catch (error) {
            showMessage('Erro: ' + error.message, 'error');
        }
    }
    
    async function handleLogout() {
        try {
            if (window.firebaseAuth) {
                await window.firebaseAuth.logout();
                showMessage('Logout realizado!');
                elements.userProfile.style.display = 'none';
            }
        } catch (error) {
            showMessage('Erro: ' + error.message, 'error');
        }
    }
    
    // Other Functions
    function changeLanguage(lang) {
        showMessage(`Idioma alterado para: ${lang}`);
        // Implementar mudança de idioma aqui
    }
    
    function openEventModal(eventType) {
        const eventModal = document.getElementById('eventModal');
        const eventTypeSpan = document.getElementById('eventType');
        if (eventModal && eventTypeSpan) {
            eventTypeSpan.textContent = eventType;
            eventModal.style.display = 'flex';
        }
    }
    
    function contactStaff(staff, phone) {
        const message = `Olá ${staff}, gostaria de falar sobre os serviços da cafeteria.`;
        const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    function handleContact(form) {
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        if (name && email && message) {
            showMessage('Mensagem enviada com sucesso!');
            form.reset();
        } else {
            showMessage('Preencha todos os campos', 'error');
        }
    }
    
    function handleEventForm(form) {
        showMessage('Solicitação de orçamento enviada!');
        form.reset();
        closeModal('eventModal');
    }
    
    // UI Update
    function updateUI(user) {
        currentUser = user;
        if (user) {
            const name = user.displayName || user.email.split('@')[0];
            elements.loginBtn.innerHTML = `👤 ${name}`;
            
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userAvatar = document.getElementById('userAvatar');
            
            if (userName) userName.textContent = user.displayName || name;
            if (userEmail) userEmail.textContent = user.email;
            if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            elements.loginBtn.innerHTML = '👤 Login';
        }
    }
    
    // Message System
    function showMessage(message, type = 'success') {
        let messageEl = document.getElementById('globalMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'globalMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                max-width: 300px;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#dc3545' : '#28a745';
        messageEl.style.display = 'block';
        messageEl.style.opacity = '1';
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.style.display = 'none', 300);
        }, 3000);
    }
    
    // Firebase Auth State Listener
    if (window.firebaseAuth) {
        window.firebaseAuth.onAuthStateChanged(updateUI);
    }
    
    // Initialize
    console.log('Sistema de eventos carregado');
});