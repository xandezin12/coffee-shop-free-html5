/**
 * French Language Pack
 */

const fr = {
    // Navigation
    nav: {
        welcome: "Bienvenue",
        services: "Services",
        menu: "Menu",
        about: "À Propos",
        special: "Spécial",
        events: "Événements",
        team: "Notre Équipe",
        contact: "Contact",
        login: "Connexion"
    },

    // Header
    header: {
        title: "café - c'est génial",
        subtitle: "le café me fait du bien, améliore ma journée !!!",
        cta: "spécial du jour"
    },

    // Services
    services: {
        title: "Ce que nous offrons",
        subtitle: "Dans notre café, chaque détail est pensé pour offrir une expérience unique. Du grain à la tasse, tout est préparé avec passion, qualité et une touche d'innovation.",
        coffee: {
            title: "Cafés",
            description: "Nous travaillons avec des grains sélectionnés de haute qualité, extraits avec précision pour rehausser les arômes et saveurs qui font du café bien plus qu'une boisson : un rituel."
        },
        tea: {
            title: "Thés",
            description: "Nous offrons une curation spéciale de thés nationaux et importés, parfaits pour ceux qui recherchent l'équilibre, l'arôme et une pause tranquille au milieu de l'agitation."
        },
        cakes: {
            title: "Gâteaux",
            description: "Recettes artisanales qui combinent tradition et créativité. Nos gâteaux sont faits avec des ingrédients frais et du soin, idéaux pour accompagner votre café ou thé."
        },
        highlight: "Bien plus qu'un café — nous sommes un point de rencontre pour ceux qui valorisent la saveur, la chaleur et les bonnes conversations. Venez découvrir l'arôme de votre nouveau lieu favori.",
        cta: "RÉSERVEZ VOTRE TABLE"
    },

    // Menu
    menu: {
        title: "Notre Menu",
        subtitle: "Explorez notre menu spécial avec des cafés, thés et douceurs artisanales. Chaque article est préparé avec amour et des ingrédients sélectionnés.",
        categories: {
            cafes: "☕ Cafés",
            chas: "🍃 Thés",
            doces: "🧁 Douceurs"
        },
        actions: {
            customize: "Personnaliser",
            order_now: "Commander Maintenant",
            added: "Ajouté !"
        }
    },

    // About
    about: {
        title: "À Propos de Nous",
        who_we_are: "Qui nous sommes",
        who_description: "Nous sommes passionnés de café, de saveur et de bonnes expériences. Notre café est né du désir de créer un espace où chaque tasse raconte une histoire — de l'origine des grains au soin dans la préparation. Plus qu'un café, nous sommes un refuge urbain fait pour ceux qui valorisent la qualité et la chaleur.",
        why_choose: "Pourquoi nous choisir ?",
        why_description: "Parce qu'ici vous trouvez plus que des boissons incroyables : vous trouvez un service attentionné, un environnement accueillant et une curation de saveurs qui surprend à chaque visite. Tout pensé pour que vous vous sentiez chez vous — ou encore mieux."
    },

    // Team
    team: {
        title: "Rencontrez Notre Équipe",
        subtitle: "Derrière chaque tasse servie, il y a une équipe passionnée de saveurs, d'hospitalité et de bonnes expériences. Rencontrez ceux qui donnent une âme à notre café."
    },

    // Events
    events: {
        title: "Événements Spéciaux",
        subtitle: "Vous planifiez un événement spécial ? Notre équipe est prête à créer des expériences uniques avec des menus personnalisés pour mariages, entreprises, anniversaires et bien plus !",
        types: {
            wedding: "Mariages",
            corporate: "Entreprise",
            birthday: "Anniversaires"
        },
        descriptions: {
            wedding: "Menu spécial pour votre jour le plus important",
            corporate: "Pauses café et événements d'entreprise",
            birthday: "Célébrations spéciales avec une saveur unique"
        },
        cta: "Demander un Devis",
        staff_contact: "Parlez Directement avec Notre Équipe"
    },

    // Contact
    contact: {
        title: "Contactez-nous",
        subtitle: "Nous voulons vous entendre !",
        description: "Avez-vous des questions, suggestions ou compliments ? Votre opinion est très importante pour nous ! Remplissez le formulaire ci-dessous et nous vous contacterons dès que possible.",
        form: {
            name: "Votre nom",
            email: "Votre email",
            message: "Écrivez votre message...",
            submit: "Envoyer le message"
        },
        info_title: "Informations de Contact"
    },

    // Forms
    forms: {
        login: {
            title: "Connectez-vous à votre compte",
            email: "Votre email",
            password: "Votre mot de passe",
            submit: "Se Connecter",
            no_account: "Pas de compte ?",
            register_link: "S'inscrire"
        },
        register: {
            title: "Créer un compte",
            name: "Votre nom",
            email: "Votre email",
            phone: "Téléphone",
            address: "Adresse",
            password: "Créer un mot de passe",
            submit: "S'inscrire",
            have_account: "Vous avez déjà un compte ?",
            login_link: "Se Connecter"
        },
        event: {
            title: "Demander un Devis",
            name: "Votre nom",
            email: "Votre email",
            phone: "Téléphone",
            date: "Date de l'événement",
            people: "Nombre de personnes",
            description: "Décrivez votre événement et besoins spéciaux...",
            submit: "Envoyer la Demande"
        }
    },

    // Messages
    messages: {
        success: {
            registered: "Bienvenue ! Votre compte a été créé avec succès.",
            login: "Bon retour !",
            logout: "Déconnexion réussie !",
            order_confirmed: "Commande confirmée !",
            event_sent: "Demande de devis envoyée ! Notre équipe vous contactera dans les 24 heures. Merci !"
        },
        errors: {
            invalid_email: "Email invalide",
            invalid_password: "Email ou mot de passe invalide",
            user_not_found: "Utilisateur non trouvé. Veuillez vous inscrire d'abord !",
            empty_cart: "Votre panier est vide !",
            login_required: "Veuillez vous connecter pour finaliser votre commande !"
        }
    },

    // Cart
    cart: {
        title: "Votre Commande Personnalisée",
        total: "Total",
        checkout: "Finaliser la Commande",
        continue: "Continuer les Achats",
        clear: "Vider le Panier",
        delivery_info: "Votre commande sera livrée en"
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.Languages = window.Languages || {};
    window.Languages.fr = fr;
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fr;
}