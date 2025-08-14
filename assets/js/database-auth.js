/**
 * Database Authentication System
 */

class DatabaseAuth {
    constructor() {
        this.apiUrl = 'api/auth.php';
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user_data') || 'null');
    }

    async register(userData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    ...userData
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }

    async login(email, password) {
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
            return { success: false, error: 'Network error' };
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
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const password = document.getElementById('regPassword').value;
    
    const result = await dbAuth.register({
        name, email, phone, address, password
    });
    
    if (result.success) {
        alert('Conta criada com sucesso! Faça login agora.');
        document.getElementById('showLoginLink').click();
    } else {
        alert('Erro: ' + result.error);
    }
};

window.login = async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await dbAuth.login(email, password);
    
    if (result.success) {
        document.getElementById('loginModal').style.display = 'none';
        updateLoginButton();
        alert('Login realizado com sucesso!');
    } else {
        alert('Erro: ' + result.error);
    }
};

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
    document.getElementById('logoutBtn').addEventListener('click', function() {
        dbAuth.logout();
        updateLoginButton();
        alert('Logout realizado com sucesso!');
    });
});