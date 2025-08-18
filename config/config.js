/**
 * Coffee Shop Configuration
 * Centralized configuration management
 */

const CoffeeShopConfig = {
    // Site Information
    site: {
        name: "Coffee Shop",
        tagline: "cafezin - é dahora",
        description: "café faz mó bem, melhora meu dia!!!",
        logo: "assets/img/logo.png"
    },

    // Contact Information
    contact: {
        email: "contact@coffeeshop.com",
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
        address: {
            street: "Rua das Palmeiras, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01000-000",
            coordinates: {
                lat: -23.54008690303477,
                lng: -46.652840763335085
            }
        }
    },

    // Social Media
    social: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
    },

    // Business Settings
    business: {
        currency: "R$",
        deliveryTime: "30-45 minutos",
        minimumEventPeople: 10,
        operatingHours: {
            monday: "7:00 - 22:00",
            tuesday: "7:00 - 22:00",
            wednesday: "7:00 - 22:00",
            thursday: "7:00 - 22:00",
            friday: "7:00 - 23:00",
            saturday: "8:00 - 23:00",
            sunday: "8:00 - 21:00"
        }
    },

    // Staff Information
    staff: [
        {
            id: 1,
            name: "Rennyl",
            role: "Gerente",
            phone: "11999991111",
            image: "assets/img/team/team01.jpg",
            bio: "Barista-chefe com mais de 10 anos de experiência e um dom pra extrair o melhor de cada grão."
        },
        {
            id: 2,
            name: "Kristean",
            role: "Eventos",
            phone: "11999992222",
            image: "assets/img/team/team02.jpg",
            bio: "Especialista em chás e infusões, cria combinações únicas que encantam do primeiro gole ao último aroma."
        },
        {
            id: 3,
            name: "Angilica",
            role: "Confeiteira",
            phone: "11999993333",
            image: "assets/img/team/team03.jpg",
            bio: "Confeiteira criativa e detalhista. Cada bolo é uma obra de arte feita com sabor e amor."
        },
        {
            id: 4,
            name: "Shannon",
            role: "Atendimento",
            phone: "11999994444",
            image: "assets/img/team/team04.jpg",
            bio: "Nosso gerente de atendimento: sabe o nome de todo mundo e garante que cada cliente se sinta em casa."
        }
    ],

    // Menu Categories
    menuCategories: {
        cafes: {
            name: "Cafés",
            icon: "☕",
            description: "Grãos selecionados de alta qualidade"
        },
        chas: {
            name: "Chás",
            icon: "🍃",
            description: "Curadoria especial de chás nacionais e importados"
        },
        doces: {
            name: "Doces",
            icon: "🧁",
            description: "Receitas artesanais com ingredientes frescos"
        }
    },

    // API Endpoints (for future backend integration)
    api: {
        baseUrl: "/api/v1",
        endpoints: {
            menu: "/menu",
            orders: "/orders",
            events: "/events",
            users: "/users",
            auth: "/auth"
        },
        timeout: 10000,
        retries: 3
    },

    // Security Settings
    security: {
        passwordMinLength: 8,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        maxLoginAttempts: 5,
        enableCSP: true,
        enableSecurityHeaders: true
    },

    // Feature Flags
    features: {
        userRegistration: true,
        onlineOrdering: true,
        eventBooking: true,
        geolocation: true,
        whatsappIntegration: true,
        socialLogin: false
    }
};

// Make config globally available
window.CoffeeShopConfig = CoffeeShopConfig;

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoffeeShopConfig;
}