/**
 * Security Manager System
 * Handles input validation, sanitization, and security measures
 */

class SecurityManager {
    constructor() {
        this.maxLoginAttempts = 5;
        this.loginAttempts = new Map();
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.init();
    }

    init() {
        this.setupCSP();
        this.bindSecurityEvents();
        this.cleanupExpiredSessions();
    }

    setupCSP() {
        // Add Content Security Policy meta tag if not present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const csp = document.createElement('meta');
            csp.setAttribute('http-equiv', 'Content-Security-Policy');
            csp.setAttribute('content', 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://unpkg.com; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data:; " +
                "connect-src 'self' https://nominatim.openstreetmap.org; " +
                "frame-src 'none';"
            );
            document.head.appendChild(csp);
        }
    }

    bindSecurityEvents() {
        // Prevent right-click context menu in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            document.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        // Prevent F12 and other developer tools shortcuts in production
        document.addEventListener('keydown', (e) => {
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    }

    // Input Sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Email Validation
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    // Password Validation
    validatePassword(password) {
        if (!password || password.length < 8) return false;
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }

    // Phone Validation
    validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
        return phoneRegex.test(phone);
    }

    // Name Validation
    validateName(name) {
        if (!name || name.length < 2 || name.length > 50) return false;
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        return nameRegex.test(name);
    }

    // Rate Limiting for Login Attempts
    checkLoginAttempts(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        const now = Date.now();
        
        // Reset attempts after 15 minutes
        if (now - attempts.lastAttempt > 15 * 60 * 1000) {
            attempts.count = 0;
        }
        
        if (attempts.count >= this.maxLoginAttempts) {
            const timeLeft = Math.ceil((15 * 60 * 1000 - (now - attempts.lastAttempt)) / 60000);
            throw new Error(`Too many login attempts. Try again in ${timeLeft} minutes.`);
        }
        
        return true;
    }

    recordLoginAttempt(email, success = false) {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        
        if (success) {
            this.loginAttempts.delete(email);
        } else {
            attempts.count++;
            attempts.lastAttempt = Date.now();
            this.loginAttempts.set(email, attempts);
        }
    }

    // Secure Password Comparison (timing-safe)
    timingSafeEqual(a, b) {
        if (a.length !== b.length) return false;
        
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    }

    // Hash Password (simple client-side hashing - in production use proper server-side hashing)
    async hashPassword(password) {
        try {
            const salt = window.coffeeShopConfig?.salt || 'default_salt_change_me';
            if (crypto && crypto.subtle) {
                const encoder = new TextEncoder();
                const data = encoder.encode(password + salt);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } else {
                return this.simpleHash(password + salt);
            }
        } catch (error) {
            console.warn('Crypto API not available, using fallback hash');
            const salt = window.coffeeShopConfig?.salt || 'default_salt_change_me';
            return this.simpleHash(password + salt);
        }
    }

    // Secure Local Storage Operations
    secureSetItem(key, value) {
        try {
            const secureKey = `cs_${key}`;
            const timestamp = Date.now();
            const data = {
                value: value,
                timestamp: timestamp,
                expires: timestamp + this.sessionTimeout
            };
            localStorage.setItem(secureKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Secure storage error:', error);
            return false;
        }
    }

    secureGetItem(key) {
        try {
            const secureKey = `cs_${key}`;
            const stored = localStorage.getItem(secureKey);
            if (!stored) return null;
            
            const data = JSON.parse(stored);
            if (Date.now() > data.expires) {
                localStorage.removeItem(secureKey);
                return null;
            }
            
            return data.value;
        } catch (error) {
            console.error('Secure storage retrieval error:', error);
            return null;
        }
    }

    secureRemoveItem(key) {
        try {
            const secureKey = `cs_${key}`;
            localStorage.removeItem(secureKey);
            return true;
        } catch (error) {
            console.error('Secure storage removal error:', error);
            return false;
        }
    }

    // Clean up expired sessions
    cleanupExpiredSessions() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cs_')) {
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        const data = JSON.parse(stored);
                        if (Date.now() > data.expires) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    // Remove corrupted entries
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // Form Validation
    validateForm(formData, rules) {
        const errors = [];
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors.push(`${field} is required`);
                continue;
            }
            
            if (value) {
                const sanitizedValue = this.sanitizeInput(value);
                
                switch (rule.type) {
                    case 'email':
                        if (!this.validateEmail(sanitizedValue)) {
                            errors.push(`Invalid ${field} format`);
                        }
                        break;
                    case 'password':
                        if (!this.validatePassword(sanitizedValue)) {
                            errors.push(`${field} must be at least 8 characters with uppercase, lowercase, number and special character`);
                        }
                        break;
                    case 'phone':
                        if (!this.validatePhone(sanitizedValue)) {
                            errors.push(`Invalid ${field} format`);
                        }
                        break;
                    case 'name':
                        if (!this.validateName(sanitizedValue)) {
                            errors.push(`${field} must be 2-50 characters and contain only letters`);
                        }
                        break;
                    case 'text':
                        if (rule.minLength && sanitizedValue.length < rule.minLength) {
                            errors.push(`${field} must be at least ${rule.minLength} characters`);
                        }
                        if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
                            errors.push(`${field} must be no more than ${rule.maxLength} characters`);
                        }
                        break;
                }
                
                // Update form data with sanitized value
                formData[field] = sanitizedValue;
            }
        }
        
        return { isValid: errors.length === 0, errors, sanitizedData: formData };
    }

    // Generate secure random token
    generateSecureToken(length = 32) {
        try {
            if (crypto && crypto.getRandomValues) {
                const array = new Uint8Array(length);
                crypto.getRandomValues(array);
                return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            } else {
                // Fallback for browsers without crypto API
                return this.generateFallbackToken(length);
            }
        } catch (error) {
            console.warn('Crypto API not available, using fallback token generation');
            return this.generateFallbackToken(length);
        }
    }

    // Fallback hash function for browsers without crypto.subtle
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Fallback token generation
    generateFallbackToken(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // XSS Protection for dynamic content
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string' || unsafe === null || unsafe === undefined) {
            return '';
        }
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Safe DOM manipulation
    safeSetInnerHTML(element, content) {
        if (!element) return;
        element.textContent = content; // Use textContent instead of innerHTML
    }

    safeCreateElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        // Whitelist allowed attributes
        const allowedAttributes = ['class', 'id', 'data-*', 'aria-*', 'role', 'title', 'alt', 'src', 'href'];
        
        for (const [key, value] of Object.entries(attributes)) {
            if (allowedAttributes.includes(key) || key.startsWith('data-') || key.startsWith('aria-')) {
                element.setAttribute(key, this.sanitizeInput(value));
            }
        }
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    // Security headers check
    checkSecurityHeaders() {
        const warnings = [];
        
        // Check if HTTPS is being used in production
        if (window.location.protocol !== 'https:' && 
            window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            warnings.push('Site should use HTTPS in production');
        }
        
        return warnings;
    }

    // Log security events (in production, send to server)
    logSecurityEvent(event, details = {}) {
        const sanitizedEvent = this.escapeHtml(event);
        const sanitizedDetails = typeof details === 'string' ? this.escapeHtml(details) : details;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: sanitizedEvent,
            details: sanitizedDetails,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Security Event:', logEntry);
    }
}

// Initialize security manager
const securityManager = new SecurityManager();

// Make globally available
window.securityManager = securityManager;