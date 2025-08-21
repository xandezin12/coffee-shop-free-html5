/**
 * Coffee Shop Authentication System
 * Handles user login, registration, and session management
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.bindEvents();
        this.updateLoginDisplay();
    }

    bindEvents() {
        // Login form submission
        const loginForm = document.querySelector('#loginForm form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.login(e));
        }

        // Register form submission
        const registerForm = document.querySelector('#registerForm form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.register(e));
        }

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                this.closeLogin();
            }
        });
    }

    openLogin() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeLogin() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    }

    showLogin() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }

    async register(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const userData = {
                name: formData.get('name') || document.getElementById('regName')?.value,
                email: formData.get('email') || document.getElementById('regEmail')?.value,
                phone: formData.get('phone') || document.getElementById('regPhone')?.value,
                address: formData.get('address') || document.getElementById('regAddress')?.value,
                password: formData.get('password') || document.getElementById('regPassword')?.value
            };

            // Security validation
            const validation = securityManager.validateForm(userData, {
                name: { required: true, type: 'name' },
                email: { required: true, type: 'email' },
                phone: { required: true, type: 'phone' },
                address: { required: true, type: 'text', minLength: 5, maxLength: 200 },
                password: { required: true, type: 'password' }
            });

            if (!validation.isValid) {
                this.showMessage(validation.errors[0], 'error');
                return;
            }

            // Hash password before storing
            const hashedPassword = await securityManager.hashPassword(validation.sanitizedData.password);
            const secureUserData = {
                ...validation.sanitizedData,
                password: hashedPassword,
                id: securityManager.generateSecureToken(16),
                createdAt: Date.now()
            };
            
            // Save user data securely
            if (!securityManager.secureSetItem('user', secureUserData)) {
                this.showMessage('Failed to create account. Please try again.', 'error');
                return;
            }

            this.currentUser = { ...secureUserData };
            delete this.currentUser.password; // Don't keep password in memory
            
            this.updateLoginDisplay();
            this.closeLogin();
            
            const message = languageManager.getTranslation('messages.success.registered');
            this.showMessage(message.replace('{name}', secureUserData.name));
            
            securityManager.logSecurityEvent('user_registered', { userId: secureUserData.id });
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    async login(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const email = securityManager.sanitizeInput(formData.get('email') || document.getElementById('loginEmail')?.value);
            const password = formData.get('password') || document.getElementById('loginPassword')?.value;
            
            // Validate input
            if (!securityManager.validateEmail(email)) {
                this.showMessage(languageManager.getTranslation('messages.errors.invalid_email'), 'error');
                return;
            }
            
            if (!password || password.length < 6) {
                this.showMessage(languageManager.getTranslation('messages.errors.invalid_password'), 'error');
                return;
            }
            
            // Check rate limiting
            try {
                securityManager.checkLoginAttempts(email);
            } catch (rateLimitError) {
                this.showMessage(rateLimitError.message, 'error');
                return;
            }
            
            const savedUser = securityManager.secureGetItem('user');
            
            if (savedUser && savedUser.email === email) {
                const hashedPassword = await securityManager.hashPassword(password);
                
                if (securityManager.timingSafeEqual(savedUser.password, hashedPassword)) {
                    // Successful login
                    securityManager.recordLoginAttempt(email, true);
                    
                    this.currentUser = { ...savedUser };
                    delete this.currentUser.password; // Don't keep password in memory
                    
                    this.updateLoginDisplay();
                    this.closeLogin();
                    
                    const message = languageManager.getTranslation('messages.success.login');
                    this.showMessage(message.replace('{name}', savedUser.name));
                    
                    securityManager.logSecurityEvent('user_login', { userId: savedUser.id });
                } else {
                    // Failed login
                    securityManager.recordLoginAttempt(email, false);
                    this.showMessage(languageManager.getTranslation('messages.errors.invalid_password'), 'error');
                    securityManager.logSecurityEvent('failed_login', { email: email });
                }
            } else {
                securityManager.recordLoginAttempt(email, false);
                this.showMessage(languageManager.getTranslation('messages.errors.user_not_found'), 'error');
                securityManager.logSecurityEvent('login_user_not_found', { email: email });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    logout() {
        if (this.currentUser) {
            securityManager.logSecurityEvent('user_logout', { userId: this.currentUser.id });
        }
        
        this.currentUser = null;
        securityManager.secureRemoveItem('user');
        this.updateLoginDisplay();
        
        const message = languageManager.getTranslation('messages.success.logout');
        this.showMessage(message);
    }

    updateLoginDisplay() {
        const loginBtn = document.getElementById('loginBtn');
        
        if (loginBtn) {
            if (this.currentUser) {
                const firstName = this.currentUser.name ? securityManager.escapeHtml(this.currentUser.name.split(' ')[0] || 'User') : 'User';
                securityManager.safeSetInnerHTML(loginBtn, `👤 ${firstName}`);
                loginBtn.onclick = () => this.toggleProfile();
                
                // Update profile display
                const userName = document.getElementById('userName');
                const userEmail = document.getElementById('userEmail');
                
                if (userName) securityManager.safeSetInnerHTML(userName, this.currentUser.name);
                if (userEmail) securityManager.safeSetInnerHTML(userEmail, this.currentUser.email);
            } else {
                const loginText = languageManager.getTranslation('nav.login');
                securityManager.safeSetInnerHTML(loginBtn, `👤 ${loginText}`);
                loginBtn.onclick = () => this.openLogin();
                
                const userProfile = document.getElementById('userProfile');
                if (userProfile) userProfile.style.display = 'none';
            }
        }
    }

    toggleProfile() {
        const profile = document.getElementById('userProfile');
        if (profile) {
            profile.style.display = profile.style.display === 'block' ? 'none' : 'block';
        } else {
            console.warn('User profile element not found');
        }
    }

    // Removed - now using SecurityManager validation

    showMessage(message, type = 'success') {
        // Create or update message element
        let messageEl = document.getElementById('authMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'authMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#ff4757' : '#2ed573';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    loadUser() {
        try {
            const savedUser = securityManager.secureGetItem('user');
            if (savedUser) {
                this.currentUser = { ...savedUser };
                delete this.currentUser.password; // Don't keep password in memory
            }
        } catch (error) {
            console.error('Error loading user:', error);
            securityManager.secureRemoveItem('user');
        }
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Global functions for backward compatibility
window.openLogin = () => authSystem.openLogin();
window.closeLogin = () => authSystem.closeLogin();
window.showRegister = () => authSystem.showRegister();
window.showLogin = () => authSystem.showLogin();
window.register = (event) => authSystem.register(event);
window.login = (event) => authSystem.login(event);
window.logout = () => authSystem.logout();

// Make auth system globally available
window.authSystem = authSystem;