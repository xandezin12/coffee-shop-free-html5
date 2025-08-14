/**
 * Spanish Language Pack
 */

const es = {
    // Navigation
    nav: {
        welcome: "Bienvenido",
        services: "Servicios",
        menu: "Menú",
        about: "Sobre Nosotros",
        special: "Especial",
        events: "Eventos",
        team: "Nuestro Equipo",
        contact: "Contacto",
        login: "Iniciar Sesión"
    },

    // Header
    header: {
        title: "cafetería - es genial",
        subtitle: "el café me hace sentir bien, mejora mi día!!!",
        cta: "especial del día"
    },

    // Services
    services: {
        title: "Lo que ofrecemos",
        subtitle: "En nuestra cafetería, cada detalle está pensado para ofrecer una experiencia única. Del grano a la taza, todo se prepara con pasión, calidad y un toque de innovación.",
        coffee: {
            title: "Cafés",
            description: "Trabajamos con granos seleccionados de alta calidad, extraídos con precisión para realzar los aromas y sabores que hacen del café mucho más que una bebida: un ritual."
        },
        tea: {
            title: "Tés",
            description: "Ofrecemos una curaduría especial de tés nacionales e importados, perfectos para quienes buscan equilibrio, aroma y una pausa tranquila en medio de la prisa."
        },
        cakes: {
            title: "Pasteles",
            description: "Recetas artesanales que combinan tradición y creatividad. Nuestros pasteles están hechos con ingredientes frescos y cariño, ideales para acompañar tu café o té."
        },
        highlight: "Mucho más que una cafetería — somos un punto de encuentro para quienes valoran el sabor, la calidez y las buenas conversaciones. Ven a descubrir el aroma de tu nuevo lugar favorito.",
        cta: "RESERVA TU MESA"
    },

    // Menu
    menu: {
        title: "Nuestro Menú",
        subtitle: "Explora nuestro menú especial con cafés, tés y dulces artesanales. Cada artículo se prepara con amor e ingredientes seleccionados.",
        categories: {
            cafes: "☕ Cafés",
            chas: "🍃 Tés",
            doces: "🧁 Dulces"
        },
        actions: {
            customize: "Personalizar",
            order_now: "Pedir Ahora",
            added: "¡Agregado!"
        }
    },

    // About
    about: {
        title: "Sobre Nosotros",
        who_we_are: "Quiénes somos",
        who_description: "Somos apasionados del café, el sabor y las buenas experiencias. Nuestra cafetería nació del deseo de crear un espacio donde cada taza cuenta una historia — desde el origen de los granos hasta el cuidado en la preparación. Más que una cafetería, somos un refugio urbano hecho para quienes valoran la calidad y la calidez.",
        why_choose: "¿Por qué elegirnos?",
        why_description: "Porque aquí encuentras más que bebidas increíbles: encuentras un servicio atento, un ambiente acogedor y una curaduría de sabores que sorprende en cada visita. Todo pensado para que te sientas como en casa — o incluso mejor."
    },

    // Team
    team: {
        title: "Conoce Nuestro Equipo",
        subtitle: "Detrás de cada taza servida, hay un equipo apasionado por los sabores, la hospitalidad y las buenas experiencias. Conoce a quienes dan alma a nuestra cafetería."
    },

    // Events
    events: {
        title: "Eventos Especiales",
        subtitle: "¿Planificando un evento especial? ¡Nuestro equipo está listo para crear experiencias únicas con menús personalizados para bodas, corporativos, cumpleaños y mucho más!",
        types: {
            wedding: "Bodas",
            corporate: "Corporativo",
            birthday: "Cumpleaños"
        },
        descriptions: {
            wedding: "Menú especial para tu día más importante",
            corporate: "Coffee breaks y eventos empresariales",
            birthday: "Celebraciones especiales con sabor único"
        },
        cta: "Solicitar Cotización",
        staff_contact: "Habla Directamente con Nuestro Equipo"
    },

    // Contact
    contact: {
        title: "Contáctanos",
        subtitle: "¡Queremos escucharte!",
        description: "¿Tienes alguna pregunta, sugerencia o elogio? ¡Tu opinión es muy importante para nosotros! Completa el formulario a continuación y nos pondremos en contacto lo antes posible.",
        form: {
            name: "Tu nombre",
            email: "Tu email",
            message: "Escribe tu mensaje...",
            submit: "Enviar mensaje"
        },
        info_title: "Información de Contacto"
    },

    // Forms
    forms: {
        login: {
            title: "Iniciar sesión en tu cuenta",
            email: "Tu email",
            password: "Tu contraseña",
            submit: "Iniciar Sesión",
            no_account: "¿No tienes cuenta?",
            register_link: "Regístrate"
        },
        register: {
            title: "Crear cuenta",
            name: "Tu nombre",
            email: "Tu email",
            phone: "Teléfono",
            address: "Dirección",
            password: "Crear contraseña",
            submit: "Registrarse",
            have_account: "¿Ya tienes cuenta?",
            login_link: "Iniciar Sesión"
        },
        event: {
            title: "Solicitar Cotización",
            name: "Tu nombre",
            email: "Tu email",
            phone: "Teléfono",
            date: "Fecha del evento",
            people: "Número de personas",
            description: "Describe tu evento y necesidades especiales...",
            submit: "Enviar Solicitud"
        }
    },

    // Messages
    messages: {
        success: {
            registered: "¡Bienvenido! Tu cuenta ha sido creada exitosamente.",
            login: "¡Bienvenido de vuelta!",
            logout: "¡Cierre de sesión exitoso!",
            order_confirmed: "¡Pedido confirmado!",
            event_sent: "¡Solicitud de cotización enviada! Nuestro equipo se pondrá en contacto contigo en 24 horas. ¡Gracias!"
        },
        errors: {
            invalid_email: "Email inválido",
            invalid_password: "Email o contraseña inválidos",
            user_not_found: "Usuario no encontrado. ¡Por favor regístrate primero!",
            empty_cart: "¡Tu carrito está vacío!",
            login_required: "¡Por favor inicia sesión para completar tu pedido!"
        }
    },

    // Cart
    cart: {
        title: "Tu Pedido Personalizado",
        total: "Total",
        checkout: "Finalizar Pedido",
        continue: "Continuar Comprando",
        clear: "Limpiar Carrito",
        delivery_info: "Tu pedido será entregado en"
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.Languages = window.Languages || {};
    window.Languages.es = es;
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = es;
}