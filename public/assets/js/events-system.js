/**
 * Coffee Shop Events System
 * Handles event booking and staff contact functionality
 */

class EventsSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Event form submission
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => this.submitEventForm(e));
        }

        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                this.closeEventForm();
            }
        });

        // Click outside modal to close
        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target === eventModal) {
                    this.closeEventForm();
                }
            });
        }
    }

    openEventForm(eventType) {
        const eventTypeElement = document.getElementById('eventType');
        const eventModal = document.getElementById('eventModal');
        
        if (eventTypeElement) eventTypeElement.textContent = eventType;
        if (eventModal) eventModal.style.display = 'flex';
    }

    closeEventForm() {
        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            eventModal.style.display = 'none';
        }
    }

    submitEventForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const eventType = document.getElementById('eventType')?.textContent || 'Evento';
        
        const eventData = {
            type: eventType,
            name: formData.get('name') || event.target.querySelector('input[type="text"]')?.value,
            email: formData.get('email') || event.target.querySelector('input[type="email"]')?.value,
            phone: formData.get('phone') || event.target.querySelector('input[type="tel"]')?.value,
            date: formData.get('date') || event.target.querySelector('input[type="date"]')?.value,
            people: formData.get('people') || event.target.querySelector('input[type="number"]')?.value,
            description: formData.get('description') || event.target.querySelector('textarea')?.value,
            timestamp: new Date().toISOString()
        };

        // Validate form data
        if (!this.validateEventData(eventData)) {
            return;
        }

        // Save event request
        this.saveEventRequest(eventData);
        
        // Show success message
        this.showMessage(`Solicitação de orçamento enviada!\n\nTipo: ${eventType}\n\nNossa equipe entrará em contato em até 24 horas.\n\nObrigado!`);
        
        // Close form and reset
        this.closeEventForm();
        event.target.reset();
    }

    validateEventData(eventData) {
        if (!eventData.name || eventData.name.length < 2) {
            this.showMessage('Nome é obrigatório', 'error');
            return false;
        }
        
        if (!this.isValidEmail(eventData.email)) {
            this.showMessage('E-mail inválido', 'error');
            return false;
        }
        
        if (!eventData.phone || eventData.phone.length < 10) {
            this.showMessage('Telefone inválido', 'error');
            return false;
        }
        
        if (!eventData.date) {
            this.showMessage('Data do evento é obrigatória', 'error');
            return false;
        }
        
        if (!eventData.people || eventData.people < 10) {
            this.showMessage('Número mínimo de pessoas é 10', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    saveEventRequest(eventData) {
        // Get existing requests
        const existingRequests = JSON.parse(localStorage.getItem('eventRequests') || '[]');
        
        // Add new request
        existingRequests.push(eventData);
        
        // Save back to localStorage
        localStorage.setItem('eventRequests', JSON.stringify(existingRequests));
    }

    contactStaff(name, phone) {
        const message = `Olá ${name}! Gostaria de falar sobre eventos especiais na cafeteria.`;
        const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    showMessage(message, type = 'success') {
        // Create or update message element
        let messageEl = document.getElementById('eventsMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'eventsMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                transition: all 0.3s ease;
                text-align: center;
                max-width: 400px;
                white-space: pre-line;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#ff4757' : '#2ed573';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    getEventRequests() {
        return JSON.parse(localStorage.getItem('eventRequests') || '[]');
    }
}

// Initialize events system
const eventsSystem = new EventsSystem();

// Global functions for backward compatibility
window.openEventForm = (eventType) => eventsSystem.openEventForm(eventType);
window.closeEventForm = () => eventsSystem.closeEventForm();
window.contactStaff = (name, phone) => eventsSystem.contactStaff(name, phone);

// Make events system globally available
window.eventsSystem = eventsSystem;