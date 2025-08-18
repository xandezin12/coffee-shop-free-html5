/**
 * Enhanced Authentication System
 * Improved UX, validation, and security
 */

class EnhancedAuth {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        try {
            this.loadUser();
            this.bindEvents();
            this.updateLoginDisplay();
            this.setupPasswordToggles();
            this.setupFormValidation();
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Fallback: basic login button functionality
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.onclick = () => this.openLogin();
            }
        }
    }

    bindEvents() {
        // Modal events
        document.getElementById('loginBtn')?.addEventListener('click', () => this.openLogin());
        document.getElementById('closeLoginBtn')?.addEventListener('click', () => this.closeLogin());
        
        // Form switch events
        document.getElementById('showRegisterLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });
        
        document.getElementById('showLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Form submissions
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => this.handleRegister(e));

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // Close modal on backdrop click
        document.getElementById('loginModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.closeLogin();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('loginModal')?.style.display === 'flex') {
                this.closeLogin();
            }
        });
    }

    setupPasswordToggles() {
        const toggles = ['loginPasswordToggle', 'regPasswordToggle'];
        
        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const passwordField = toggleId === 'loginPasswordToggle' 
                        ? document.getElementById('loginPassword')
                        : document.getElementById('regPassword');
                    
                    const icon = toggle.querySelector('i');
                    
                    if (passwordField.type === 'password') {
                        passwordField.type = 'text';
                        icon.className = 'fa fa-eye-slash';
                    } else {
                        passwordField.type = 'password';
                        icon.className = 'fa fa-eye';
                    }
                });
            }
        });
    }

    setupFormValidation() {
        try {
            // Real-time validation
            const inputs = [
                { id: 'loginEmail', validator: this.validateEmail },
                { id: 'loginPassword', validator: this.validateLoginPassword },
                { id: 'regName', validator: this.validateName },
                { id: 'regEmail', validator: this.validateEmail },
                { id: 'regPhone', validator: this.validatePhone },
                { id: 'regAddress', validator: this.validateAddress },
                { id: 'regPassword', validator: this.validatePassword }
            ];

            inputs.forEach(({ id, validator }) => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('blur', () => {
                        try {
                            this.validateField(id, validator);
                        } catch (error) {
                            console.error('Validation error:', error);
                        }
                    });
                    
                    input.addEventListener('input', () => {
                        try {
                            this.clearFieldError(id);
                        } catch (error) {
                            console.error('Clear error:', error);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Setup validation error:', error);
        }
    }

    validateField(fieldId, validator) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (!field || !errorEl) return true;

        const result = validator.call(this, field.value);
        
        if (result.isValid) {
            field.classList.remove('error');
            errorEl.style.display = 'none';
            return true;
        } else {
            field.classList.add('error');
            errorEl.textContent = result.message;
            errorEl.style.display = 'block';
            return false;
        }
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (field && errorEl) {
            field.classList.remove('error');
            errorEl.style.display = 'none';
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            return { isValid: false, message: 'E-mail é obrigatório' };
        }
        
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Formato de e-mail inválido' };
        }
        
        return { isValid: true };
    }

    validateLoginPassword(password) {
        if (!password) {
            return { isValid: false, message: 'Senha é obrigatória' };
        }
        
        return { isValid: true };
    }

    validatePassword(password) {
        if (!password) {
            return { isValid: false, message: 'Senha é obrigatória' };
        }
        
        if (password.length < 8) {
            return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { isValid: false, message: 'Senha deve conter maiúscula, minúscula e número' };
        }
        
        return { isValid: true };
    }

    validateName(name) {
        if (!name) {
            return { isValid: false, message: 'Nome é obrigatório' };
        }
        
        if (name.length < 2) {
            return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            return { isValid: false, message: 'Nome deve conter apenas letras' };
        }
        
        return { isValid: true };
    }

    validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        
        if (!phone) {
            return { isValid: false, message: 'Telefone é obrigatório' };
        }
        
        // Auto-format phone
        const formatted = this.formatPhone(phone);
        if (formatted !== phone) {
            const phoneInput = document.getElementById('regPhone');
            if (phoneInput) {
                phoneInput.value = formatted;
            }
        }
        
        if (!phoneRegex.test(formatted)) {
            return { isValid: false, message: 'Formato: (11) 99999-9999' };
        }
        
        return { isValid: true };
    }

    validateAddress(address) {
        if (!address) {
            return { isValid: false, message: 'Endereço é obrigatório' };
        }
        
        if (address.length < 10) {
            return { isValid: false, message: 'Endereço deve ser mais detalhado' };
        }
        
        return { isValid: true };
    }

    formatPhone(phone) {
        const numbers = phone.replace(/\D/g, '');
        
        if (numbers.length === 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        } else if (numbers.length === 10) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        }
        
        return phone;
    }

    async handleLogin(event) {
        event.preventDefault();
        
        if (this.isLoading) return;
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate fields
        const emailValid = this.validateField('loginEmail', this.validateEmail);
        const passwordValid = this.validateField('loginPassword', this.validateLoginPassword);
        
        if (!emailValid || !passwordValid) {
            return;
        }
        
        this.setLoading('loginSubmitBtn', true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check stored user (simplified for demo)
            const storedUser = localStorage.getItem('coffee_shop_user');
            
            if (storedUser) {
                const user = JSON.parse(storedUser);
                
                if (user.email === email && user.password === password) {
                    this.currentUser = { ...user };
                    delete this.currentUser.password;
                    
                    this.showSuccess('loginSuccess', 'Login realizado com sucesso!');
                    
                    setTimeout(() => {
                        this.closeLogin();
                        this.updateLoginDisplay();
                        this.showMessage('Bem-vindo de volta, ' + this.currentUser.name + '!', 'success');
                    }, 1000);
                } else {
                    this.showMessage('E-mail ou senha incorretos', 'error');
                }
            } else {
                this.showMessage('Usuário não encontrado. Cadastre-se primeiro.', 'error');
            }
        } catch (error) {
            this.showMessage('Erro no login. Tente novamente.', 'error');
        } finally {
            this.setLoading('loginSubmitBtn', false);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        if (this.isLoading) return;
        
        const formData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            address: document.getElementById('regAddress').value,
            password: document.getElementById('regPassword').value
        };
        
        // Validate all fields
        const validations = [
            this.validateField('regName', this.validateName),
            this.validateField('regEmail', this.validateEmail),
            this.validateField('regPhone', this.validatePhone),
            this.validateField('regAddress', this.validateAddress),
            this.validateField('regPassword', this.validatePassword)
        ];
        
        if (!validations.every(v => v)) {
            return;
        }
        
        this.setLoading('registerSubmitBtn', true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user already exists
            const existingUser = localStorage.getItem('coffee_shop_user');
            if (existingUser) {
                const user = JSON.parse(existingUser);
                if (user.email === formData.email) {
                    this.showMessage('E-mail já cadastrado. Faça login.', 'error');
                    return;
                }
            }
            
            // Save user
            const userData = {
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('coffee_shop_user', JSON.stringify(userData));
            
            this.showSuccess('registerSuccess', 'Conta criada com sucesso!');
            
            setTimeout(() => {
                this.showLogin();
                this.showMessage('Conta criada! Agora faça login.', 'success');
            }, 1000);
            
        } catch (error) {
            this.showMessage('Erro no cadastro. Tente novamente.', 'error');
        } finally {
            this.setLoading('registerSubmitBtn', false);
        }
    }

    setLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        this.isLoading = loading;
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            const textEl = button.querySelector('.btn-text');
            if (textEl) {
                textEl.textContent = 'Carregando...';
            } else {
                button.textContent = 'Carregando...';
            }
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            const originalText = buttonId === 'loginSubmitBtn' ? 'Entrar' : 'Cadastrar';
            const textEl = button.querySelector('.btn-text');
            if (textEl) {
                textEl.textContent = originalText;
            } else {
                button.textContent = originalText;
            }
        }
    }

    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
    }

    openLogin() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                document.getElementById('loginEmail')?.focus();
            }, 100);
        }
    }

    closeLogin() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            this.clearAllErrors();
        }
    }

    showRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('regName')?.focus();
        }, 100);
    }

    showLogin() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        
        setTimeout(() => {
            document.getElementById('loginEmail')?.focus();
        }, 100);
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.login-content input');
        
        errorElements.forEach(el => el.style.display = 'none');
        inputElements.forEach(el => el.classList.remove('error'));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('coffee_shop_user');
        this.updateLoginDisplay();
        this.showMessage('Logout realizado com sucesso!', 'success');
    }

    updateLoginDisplay() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        
        if (this.currentUser) {
            if (loginBtn) {
                const firstName = this.currentUser.name ? this.currentUser.name.split(' ')[0] : 'Usuário';
                loginBtn.innerHTML = `👤 ${firstName}`;
                loginBtn.onclick = () => this.toggleProfile();
            }
            
            if (userProfile) {
                userProfile.style.display = 'block';
                const userNameEl = document.getElementById('userName');
                const userEmailEl = document.getElementById('userEmail');
                
                if (userNameEl) userNameEl.textContent = this.currentUser.name || '';
                if (userEmailEl) userEmailEl.textContent = this.currentUser.email || '';
            }
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = '👤 Login';
                loginBtn.onclick = () => this.openLogin();
            }
            
            if (userProfile) {
                userProfile.style.display = 'none';
            }
        }
    }

    toggleProfile() {
        const profile = document.getElementById('userProfile');
        if (profile) {
            profile.style.display = profile.style.display === 'block' ? 'none' : 'block';
        }
    }

    loadUser() {
        try {
            const userData = localStorage.getItem('coffee_shop_user');
            if (userData) {
                const user = JSON.parse(userData);
                this.currentUser = { ...user };
                delete this.currentUser.password;
            }
        } catch (error) {
            console.error('Error loading user:', error);
            localStorage.removeItem('coffee_shop_user');
        }
    }

    showMessage(message, type = 'info') {
        let messageEl = document.getElementById('authMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'authMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#dc3545' : 
                                   type === 'success' ? '#28a745' : '#007bff';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 300);
            }
        }, 3000);
    }
}

// Initialize enhanced auth system
const enhancedAuth = new EnhancedAuth();

// Global functions for compatibility
window.openLogin = () => enhancedAuth.openLogin();
window.closeLogin = () => enhancedAuth.closeLogin();
window.logout = () => enhancedAuth.logout();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);