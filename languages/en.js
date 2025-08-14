/**
 * English Language Pack
 */

const en = {
    // Navigation
    nav: {
        welcome: "Welcome",
        services: "Services",
        menu: "Menu",
        about: "About Us",
        special: "Special",
        events: "Events",
        team: "Our Team",
        contact: "Contact",
        login: "Login"
    },

    // Header
    header: {
        title: "coffee shop - it's awesome",
        subtitle: "coffee makes me feel good, improves my day!!!",
        cta: "special of the day"
    },

    // Services
    services: {
        title: "What we offer",
        subtitle: "In our coffee shop, every detail is designed to offer a unique experience. From bean to cup, everything is prepared with passion, quality and a touch of innovation.",
        coffee: {
            title: "Coffees",
            description: "We work with selected high-quality beans, extracted with precision to enhance the aromas and flavors that make coffee much more than a drink: a ritual."
        },
        tea: {
            title: "Teas",
            description: "We offer a special curation of national and imported teas, perfect for those seeking balance, aroma and a quiet break in the middle of the rush."
        },
        cakes: {
            title: "Cakes",
            description: "Artisanal recipes that combine tradition and creativity. Our cakes are made with fresh ingredients and care, ideal to accompany your coffee or tea."
        },
        highlight: "Much more than a coffee shop — we are a meeting point for those who value flavor, warmth and good conversations. Come discover the aroma of your new favorite place.",
        cta: "RESERVE YOUR TABLE"
    },

    // Menu
    menu: {
        title: "Our Menu",
        subtitle: "Explore our special menu with coffees, teas and artisanal sweets. Each item is prepared with love and selected ingredients.",
        categories: {
            cafes: "☕ Coffees",
            chas: "🍃 Teas",
            doces: "🧁 Sweets"
        },
        actions: {
            customize: "Customize",
            order_now: "Order Now",
            added: "Added!"
        }
    },

    // About
    about: {
        title: "About Us",
        who_we_are: "Who we are",
        who_description: "We are passionate about coffee, flavor and good experiences. Our coffee shop was born from the desire to create a space where each cup tells a story — from the origin of the beans to the care in preparation. More than a coffee shop, we are an urban refuge made for those who value quality and warmth.",
        why_choose: "Why choose us?",
        why_description: "Because here you find more than incredible drinks: you find attentive service, a welcoming environment and a curation of flavors that surprises with each visit. Everything designed to make you feel at home — or even better."
    },

    // Team
    team: {
        title: "Meet Our Team",
        subtitle: "Behind every cup served, there is a team passionate about flavors, hospitality and good experiences. Meet those who give soul to our coffee shop."
    },

    // Events
    events: {
        title: "Special Events",
        subtitle: "Planning a special event? Our team is ready to create unique experiences with personalized menus for weddings, corporate, birthdays and much more!",
        types: {
            wedding: "Weddings",
            corporate: "Corporate",
            birthday: "Birthdays"
        },
        descriptions: {
            wedding: "Special menu for your most important day",
            corporate: "Coffee breaks and corporate events",
            birthday: "Special celebrations with unique flavor"
        },
        cta: "Request Quote",
        staff_contact: "Talk Directly with Our Team"
    },

    // Contact
    contact: {
        title: "Contact Us",
        subtitle: "We want to hear from you!",
        description: "Have any questions, suggestions or compliments? Your opinion is very important to us! Fill out the form below and we will get in touch as soon as possible.",
        form: {
            name: "Your name",
            email: "Your email",
            message: "Write your message...",
            submit: "Send message"
        },
        info_title: "Contact Information"
    },

    // Forms
    forms: {
        login: {
            title: "Login to your account",
            email: "Your email",
            password: "Your password",
            submit: "Login",
            no_account: "Don't have an account?",
            register_link: "Sign up"
        },
        register: {
            title: "Create account",
            name: "Your name",
            email: "Your email",
            phone: "Phone",
            address: "Address",
            password: "Create password",
            submit: "Register",
            have_account: "Already have an account?",
            login_link: "Login"
        },
        event: {
            title: "Request Quote",
            name: "Your name",
            email: "Your email",
            phone: "Phone",
            date: "Event date",
            people: "Number of people",
            description: "Describe your event and special needs...",
            submit: "Send Request"
        }
    },

    // Messages
    messages: {
        success: {
            registered: "Welcome! Your account has been created successfully.",
            login: "Welcome back!",
            logout: "Logout successful!",
            order_confirmed: "Order confirmed!",
            event_sent: "Quote request sent! Our team will contact you within 24 hours. Thank you!"
        },
        errors: {
            invalid_email: "Invalid email",
            invalid_password: "Invalid email or password",
            user_not_found: "User not found. Please register first!",
            empty_cart: "Your cart is empty!",
            login_required: "Please login to complete your order!"
        }
    },

    // Cart
    cart: {
        title: "Your Custom Order",
        total: "Total",
        checkout: "Checkout",
        continue: "Continue Shopping",
        clear: "Clear Cart",
        delivery_info: "Your order will be delivered in"
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.Languages = window.Languages || {};
    window.Languages.en = en;
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = en;
}