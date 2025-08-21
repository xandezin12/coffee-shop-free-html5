/**
 * Student Configuration File
 * Simple setup for coffee shop project
 */

window.coffeeShopConfig = {
    // Security settings
    salt: 'student_project_salt_2024', // Change this for your project
    
    // Business information
    businessName: 'Coffee Shop Student Project',
    businessEmail: 'student@example.com',
    businessPhone: '+1 (555) 123-4567',
    
    // Social media (optional)
    socialMedia: {
        facebook: 'https://facebook.com/coffeeshop',
        instagram: 'https://instagram.com/coffeeshop',
        twitter: 'https://twitter.com/coffeeshop'
    },
    
    // API settings
    apis: {
        enabled: true,
        mockData: true, // Use mock data for student project
        endpoints: {
            menu: '/api/menu',
            orders: '/api/orders',
            contact: '/api/contact'
        }
    },
    
    // Features to enable/disable
    features: {
        userRegistration: true,
        orderSystem: true,
        contactForm: true,
        weatherWidget: true,
        languageSwitch: true
    },
    
    // Default settings
    defaults: {
        language: 'pt',
        currency: 'R$',
        timezone: 'America/Sao_Paulo'
    }
};

// Initialize configuration
console.log('Coffee Shop Student Config loaded:', window.coffeeShopConfig.businessName);