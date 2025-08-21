/**
 * Simple API Integration for Students
 * Handles basic API calls and data management
 */

class SimpleAPIManager {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com'; // Free API for testing
        this.cache = new Map();
        this.init();
    }

    init() {
        console.log('Simple API Manager initialized for student project');
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        try {
            const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
            
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            };

            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Call failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Get sample posts (for demo)
    async getPosts() {
        const cacheKey = 'posts';
        
        if (this.cache.has(cacheKey)) {
            return { success: true, data: this.cache.get(cacheKey) };
        }

        const result = await this.apiCall('/posts?_limit=5');
        
        if (result.success) {
            this.cache.set(cacheKey, result.data);
        }
        
        return result;
    }

    // Get sample users (for demo)
    async getUsers() {
        const cacheKey = 'users';
        
        if (this.cache.has(cacheKey)) {
            return { success: true, data: this.cache.get(cacheKey) };
        }

        const result = await this.apiCall('/users?_limit=3');
        
        if (result.success) {
            this.cache.set(cacheKey, result.data);
        }
        
        return result;
    }

    // Simulate coffee shop menu API
    async getCoffeeMenu() {
        // Simulated coffee menu data
        const menuData = [
            {
                id: 1,
                name: 'Espresso',
                price: 2.50,
                description: 'Strong and bold coffee',
                category: 'hot'
            },
            {
                id: 2,
                name: 'Cappuccino',
                price: 3.50,
                description: 'Espresso with steamed milk foam',
                category: 'hot'
            },
            {
                id: 3,
                name: 'Iced Latte',
                price: 4.00,
                description: 'Cold coffee with milk',
                category: 'cold'
            },
            {
                id: 4,
                name: 'Frappuccino',
                price: 4.50,
                description: 'Blended iced coffee drink',
                category: 'cold'
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true, data: menuData };
    }

    // Simulate order submission
    async submitOrder(orderData) {
        try {
            // Validate order data
            if (!orderData || !orderData.items || orderData.items.length === 0) {
                throw new Error('Invalid order data');
            }

            // Sanitize order data
            const sanitizedOrder = {
                id: securityManager.generateSecureToken(8),
                items: orderData.items.map(item => ({
                    id: parseInt(item.id),
                    name: securityManager.sanitizeInput(item.name),
                    quantity: parseInt(item.quantity) || 1,
                    price: parseFloat(item.price) || 0
                })),
                total: parseFloat(orderData.total) || 0,
                customerName: securityManager.sanitizeInput(orderData.customerName || 'Guest'),
                timestamp: new Date().toISOString()
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store order locally (in real app, send to server)
            const orders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
            orders.push(sanitizedOrder);
            localStorage.setItem('coffee_orders', JSON.stringify(orders));

            return { 
                success: true, 
                data: { 
                    orderId: sanitizedOrder.id,
                    message: 'Order submitted successfully!',
                    estimatedTime: '15-20 minutes'
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user's orders
    async getUserOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
            return { success: true, data: orders };
        } catch (error) {
            return { success: false, error: 'Failed to load orders' };
        }
    }

    // Simple weather API (free service)
    async getWeather(city = 'London') {
        try {
            // Using a free weather API (no key required for basic usage)
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`;
            
            // For demo purposes, return mock data since we don't have API key
            const mockWeather = {
                name: city,
                main: {
                    temp: Math.round(Math.random() * 30 + 5), // 5-35°C
                    feels_like: Math.round(Math.random() * 30 + 5),
                    humidity: Math.round(Math.random() * 100)
                },
                weather: [
                    {
                        main: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
                        description: 'Perfect weather for coffee!'
                    }
                ]
            };

            await new Promise(resolve => setTimeout(resolve, 300));
            return { success: true, data: mockWeather };
        } catch (error) {
            return { success: false, error: 'Weather service unavailable' };
        }
    }

    // Contact form submission (simulate)
    async submitContact(formData) {
        try {
            // Validate and sanitize form data
            const validation = securityManager.validateForm(formData, {
                name: { required: true, type: 'name' },
                email: { required: true, type: 'email' },
                message: { required: true, type: 'text', minLength: 10, maxLength: 500 }
            });

            if (!validation.isValid) {
                throw new Error(validation.errors[0]);
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Store contact message locally (in real app, send to server)
            const contacts = JSON.parse(localStorage.getItem('coffee_contacts') || '[]');
            const contactMessage = {
                id: securityManager.generateSecureToken(8),
                ...validation.sanitizedData,
                timestamp: new Date().toISOString(),
                status: 'received'
            };
            
            contacts.push(contactMessage);
            localStorage.setItem('coffee_contacts', JSON.stringify(contacts));

            return { 
                success: true, 
                data: { 
                    messageId: contactMessage.id,
                    message: 'Thank you for your message! We\'ll get back to you soon.'
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('API cache cleared');
    }

    // Get cache status
    getCacheStatus() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Initialize API manager
const apiManager = new SimpleAPIManager();

// Make globally available
window.apiManager = apiManager;

// Helper functions for easy use
window.loadCoffeeMenu = async () => {
    const result = await apiManager.getCoffeeMenu();
    if (result.success) {
        console.log('Coffee menu loaded:', result.data);
        return result.data;
    } else {
        console.error('Failed to load menu:', result.error);
        return [];
    }
};

window.submitCoffeeOrder = async (orderData) => {
    const result = await apiManager.submitOrder(orderData);
    if (result.success) {
        console.log('Order submitted:', result.data);
    } else {
        console.error('Order failed:', result.error);
    }
    return result;
};

console.log('Simple API Manager ready for student project!');