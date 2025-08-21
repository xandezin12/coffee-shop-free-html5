/**
 * Database Authentication System
 */

class DatabaseAuth {
    constructor() {
        this.apiUrl = 'api/auth.php';
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user_data') || 'null');
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    async register(userData) {
        // Sanitize inputs
        const sanitizedData = {
            name: this.sanitizeInput(userData.name || ''),
            email: userData.email || '',
            phone: this.sanitizeInput(userData.phone || ''),
            address: this.sanitizeInput(userData.address || ''),
            password: userData.password || ''
        };

        // Client-side validation
        if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.password) {
            return { success: false, error: 'Todos os campos são obrigatórios' };
        }

        if (sanitizedData.password.length < 8) {
            return { success: false, error: 'Senha deve ter pelo menos 8 caracteres' };
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    ...sanitizedData
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão' };
        }
    }

    async login(email, password) {
        // Client-side validation
        if (!email || !password) {
            return { success: false, error: 'Email e senha são obrigatórios' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Formato de email inválido' };
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('auth_token', this.token);
                localStorage.setItem('user_data', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão' };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }

    isLoggedIn() {
        return this.token && this.user;
    }

    getUser() {
        return this.user;
    }
}

// Initialize database auth
const dbAuth = new DatabaseAuth();

// Override existing auth functions
window.register = async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName')?.value || '';
    const email = document.getElementById('regEmail')?.value || '';
    const phone = document.getElementById('regPhone')?.value || '';
    const address = document.getElementById('regAddress')?.value || '';
    const password = document.getElementById('regPassword')?.value || '';
    
    const result = await dbAuth.register({
        name, email, phone, address, password
    });
    
    if (result.success) {
        showMessage('Conta criada com sucesso! Faça login agora.', 'success');
        document.getElementById('showLoginLink')?.click();
    } else {
        showMessage('Erro: ' + result.error, 'error');
    }
};

window.login = async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value || '';
    const password = document.getElementById('loginPassword')?.value || '';
    
    const result = await dbAuth.login(email, password);
    
    if (result.success) {
        const modal = document.getElementById('loginModal');
        if (modal) modal.style.display = 'none';
        updateLoginButton();
        showMessage('Login realizado com sucesso!', 'success');
    } else {
        showMessage('Erro: ' + result.error, 'error');
    }
};

// Custom message system
function showMessage(message, type = 'info') {
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
    messageEl.style.background = type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#3742fa';
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        if (messageEl) messageEl.style.display = 'none';
    }, 3000);
}

function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (dbAuth.isLoggedIn()) {
        const user = dbAuth.getUser();
        loginBtn.style.display = 'none';
        userProfile.style.display = 'block';
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
    } else {
        loginBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
    }
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLoginButton();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            dbAuth.logout();
            updateLoginButton();
            showMessage('Logout realizado com sucesso!', 'success');
        });
    }
});