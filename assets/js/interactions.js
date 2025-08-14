// Button Interactions - Separated from HTML
class CoffeeShopInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMenuTabs();
    this.setupModals();
  }

  setupEventListeners() {
    // Event form buttons
    document.addEventListener('click', (e) => {
      if (e.target.dataset.event) {
        this.openEventForm(e.target.dataset.event);
      }
      
      if (e.target.dataset.staff) {
        this.contactStaff(e.target.dataset.staff, e.target.dataset.phone);
      }
      
      if (e.target.id === 'closeEventBtn') {
        this.closeEventForm();
      }
      
      if (e.target.id === 'closeLoginBtn') {
        this.closeLogin();
      }
      
      if (e.target.id === 'loginBtn') {
        this.openLogin();
      }
      
      if (e.target.id === 'logoutBtn') {
        this.logout();
      }
      
      if (e.target.id === 'showRegisterLink') {
        e.preventDefault();
        this.showRegister();
      }
      
      if (e.target.id === 'showLoginLink') {
        e.preventDefault();
        this.showLogin();
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'eventForm') {
        e.preventDefault();
        this.handleEventForm(e.target);
      }
    });
  }

  setupMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.showCategory(tab.dataset.category);
      });
      
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showCategory(tab.dataset.category);
        }
      });
    });
  }

  setupModals() {
    // Close modals on outside click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('event-modal')) {
        this.closeEventForm();
      }
      if (e.target.classList.contains('login-modal')) {
        this.closeLogin();
      }
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeEventForm();
        this.closeLogin();
      }
    });
  }

  openEventForm(eventType) {
    const modal = document.getElementById('eventModal');
    const typeElement = document.getElementById('eventType');
    
    if (typeElement) typeElement.textContent = eventType;
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      
      // Focus first input
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }

  closeEventForm() {
    const modal = document.getElementById('eventModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  handleEventForm(form) {
    const formData = new FormData(form);
    const eventType = document.getElementById('eventType')?.textContent || '';
    
    // Simulate form submission
    setTimeout(() => {
      alert(`Solicitação de orçamento enviada!\n\nTipo: ${eventType}\n\nNossa equipe entrará em contato em até 24 horas.\n\nObrigado!`);
      this.closeEventForm();
      form.reset();
    }, 1000);
  }

  contactStaff(name, phone) {
    const message = `Olá ${name}! Gostaria de falar sobre eventos especiais na cafeteria.`;
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  openLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      
      // Focus first input
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }

  closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  logout() {
    if (window.authSystem) {
      window.authSystem.logout();
    } else if (typeof logout === 'function') {
      logout();
    }
  }

  showRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('loginModalTitle');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (modalTitle) modalTitle.textContent = 'Criar conta';
  }

  showLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('loginModalTitle');
    
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (modalTitle) modalTitle.textContent = 'Entrar na sua conta';
  }

  showCategory(category) {
    // Hide all categories
    const categories = document.querySelectorAll('.menu-category');
    categories.forEach(cat => cat.style.display = 'none');
    
    // Show target category
    const targetCategory = document.getElementById(category);
    if (targetCategory) {
      targetCategory.style.display = 'block';
    }
    
    // Update tab states
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    
    // Set active tab
    const activeTab = document.querySelector(`[data-category="${category}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.focus();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CoffeeShopInteractions();
});