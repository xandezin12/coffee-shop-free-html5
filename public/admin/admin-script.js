/**
 * Coffee Shop Admin Panel Script
 */

class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDashboard();
        this.showSection('dashboard');
    }

    bindEvents() {
        // Sidebar navigation
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.showSection(section);
                this.updateActiveMenu(e.target);
            });
        });

        // Modal events
        document.querySelector('.close')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Add item form
        document.getElementById('addItemForm')?.addEventListener('submit', (e) => {
            this.addMenuItem(e);
        });

        // Settings form
        document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
            this.saveSettings(e);
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Load section data
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'menu':
                this.loadMenuItems();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    updateActiveMenu(activeLink) {
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    loadDashboard() {
        // Load statistics
        const orders = JSON.parse(localStorage.getItem('coffeeShopOrders') || '[]');
        const events = JSON.parse(localStorage.getItem('eventRequests') || '[]');
        const users = localStorage.getItem('coffeeShopUser') ? 1 : 0;
        const menuItems = this.getDefaultMenuItems().length;

        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('eventRequests').textContent = events.length;
        document.getElementById('totalUsers').textContent = users;
        document.getElementById('menuItems').textContent = menuItems;
    }

    loadMenuItems() {
        const menuItems = this.getMenuItems();
        const container = document.getElementById('menuItemsList');
        
        if (container) {
            container.innerHTML = menuItems.map(item => `
                <div class="item-row">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <small>Category: ${item.category} | Price: R$ ${item.price}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-warning btn-sm" onclick="adminPanel.editMenuItem('${item.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteMenuItem('${item.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }

    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('coffeeShopOrders') || '[]');
        const container = document.getElementById('ordersList');
        
        if (container) {
            container.innerHTML = orders.length ? orders.map(order => `
                <div class="item-row">
                    <div class="item-info">
                        <h4>Order #${order.id}</h4>
                        <p>Customer: ${order.customerName}</p>
                        <small>Date: ${new Date(order.date).toLocaleDateString()} | Total: R$ ${order.total}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-success btn-sm">Complete</button>
                        <button class="btn btn-danger btn-sm">Cancel</button>
                    </div>
                </div>
            `).join('') : '<p>No orders found.</p>';
        }
    }

    loadEvents() {
        const events = JSON.parse(localStorage.getItem('eventRequests') || '[]');
        const container = document.getElementById('eventsList');
        
        if (container) {
            container.innerHTML = events.length ? events.map(event => `
                <div class="item-row">
                    <div class="item-info">
                        <h4>${event.type} - ${event.name}</h4>
                        <p>Email: ${event.email} | Phone: ${event.phone}</p>
                        <small>Date: ${event.date} | People: ${event.people}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-success btn-sm">Approve</button>
                        <button class="btn btn-danger btn-sm">Decline</button>
                    </div>
                </div>
            `).join('') : '<p>No event requests found.</p>';
        }
    }

    loadUsers() {
        const user = localStorage.getItem('coffeeShopUser');
        const container = document.getElementById('usersList');
        
        if (container) {
            if (user) {
                const userData = JSON.parse(user);
                container.innerHTML = `
                    <div class="item-row">
                        <div class="item-info">
                            <h4>${userData.name}</h4>
                            <p>Email: ${userData.email}</p>
                            <small>Phone: ${userData.phone} | Address: ${userData.address}</small>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-warning btn-sm">Edit</button>
                            <button class="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = '<p>No users registered.</p>';
            }
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('coffeeShopSettings') || '{}');
        
        document.getElementById('siteTitle').value = settings.siteTitle || 'Coffee Shop';
        document.getElementById('contactEmail').value = settings.contactEmail || 'contato@suacafeteria.com.br';
        document.getElementById('contactPhone').value = settings.contactPhone || '(11) 99999-9999';
        document.getElementById('address').value = settings.address || 'Rua das Palmeiras, 123\nSão Paulo – SP';
    }

    saveSettings(event) {
        event.preventDefault();
        
        const settings = {
            siteTitle: document.getElementById('siteTitle').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            address: document.getElementById('address').value
        };
        
        localStorage.setItem('coffeeShopSettings', JSON.stringify(settings));
        this.showMessage('Settings saved successfully!');
    }

    showAddItemForm() {
        const modal = document.getElementById('addItemModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal() {
        const modal = document.getElementById('addItemModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    addMenuItem(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newItem = {
            id: Date.now().toString(),
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            featured: formData.get('featured') === 'on'
        };
        
        const menuItems = this.getMenuItems();
        menuItems.push(newItem);
        localStorage.setItem('coffeeShopMenuItems', JSON.stringify(menuItems));
        
        this.loadMenuItems();
        this.closeModal();
        event.target.reset();
        this.showMessage('Menu item added successfully!');
    }

    deleteMenuItem(itemId) {
        // Replace confirm with custom modal for better UX
        this.showMessage('Item deleted successfully!', 'success');
        const menuItems = this.getMenuItems().filter(item => item.id !== itemId);
        localStorage.setItem('coffeeShopMenuItems', JSON.stringify(menuItems));
        this.loadMenuItems();
    }

    getMenuItems() {
        const saved = localStorage.getItem('coffeeShopMenuItems');
        return saved ? JSON.parse(saved) : this.getDefaultMenuItems();
    }

    getDefaultMenuItems() {
        return [
            {
                id: '1',
                name: 'Espresso Especial',
                description: 'Blend exclusivo da casa com notas de chocolate e caramelo',
                category: 'cafes',
                price: 8.50,
                featured: true
            },
            {
                id: '2',
                name: 'Cappuccino Cremoso',
                description: 'Espresso com leite vaporizado e espuma aveludada',
                category: 'cafes',
                price: 12.00,
                featured: false
            },
            {
                id: '3',
                name: 'Chá Verde Premium',
                description: 'Antioxidante natural com sabor suave e refrescante',
                category: 'chas',
                price: 9.50,
                featured: true
            },
            {
                id: '4',
                name: 'Bolo de Chocolate',
                description: 'Massa fofinha com cobertura de chocolate belga',
                category: 'doces',
                price: 15.00,
                featured: false
            }
        ];
    }

    showMessage(message, type = 'success') {
        let messageEl = document.getElementById('adminMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'adminMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Global functions
window.showAddItemForm = () => adminPanel.showAddItemForm();
window.adminPanel = adminPanel;