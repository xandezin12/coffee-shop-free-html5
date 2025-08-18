/**
 * Coffee Shop Menu System
 * Handles menu display, cart functionality, and ordering
 */

class MenuSystem {
    constructor() {
        this.cart = [];
        this.cartTotal = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCart();
    }

    bindEvents() {
        // Menu category switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-tab')) {
                this.showCategory(e.target.dataset.category);
            }
        });

        // Cart toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-icon')) {
                this.toggleCart();
            }
        });

        // Price updates on size change
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('size-select')) {
                this.updatePrice(e.target);
            }
        });
    }

    showCategory(category, targetElement = null) {
        // Hide all categories
        document.querySelectorAll('.menu-category').forEach(cat => {
            cat.style.display = 'none';
        });
        
        // Show selected category
        const targetCategory = document.getElementById(category);
        if (targetCategory) {
            targetCategory.style.display = 'block';
        }
        
        // Update active tab
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        if (targetElement) {
            targetElement.classList.add('active');
        } else {
            // Fallback: find tab by data-category
            const activeTab = document.querySelector(`[data-category="${category}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        }
    }

    addToCart(button) {
        const menuItem = button.closest('.menu-item');
        const name = menuItem.querySelector('h4').textContent;
        const sizeSelect = menuItem.querySelector('.size-select');
        const milkSelect = menuItem.querySelector('.milk-select');
        const quantityInput = menuItem.querySelector('.quantity-input');
        
        const size = sizeSelect ? sizeSelect.options[sizeSelect.selectedIndex].text : 'Padrão';
        const price = sizeSelect ? parseFloat(sizeSelect.value) : parseFloat(menuItem.querySelector('.menu-price').textContent.replace('R$ ', '').replace(',', '.'));
        const milk = milkSelect ? milkSelect.value : 'Padrão';
        const quantity = parseInt(quantityInput?.value || 1);
        
        const item = {
            id: Date.now(),
            name,
            size,
            milk,
            quantity,
            price: price * quantity
        };
        
        this.cart.push(item);
        this.updateCart();
        this.saveCart();
        
        // Visual feedback
        this.showAddedFeedback(button);
    }

    showAddedFeedback(button) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        button.style.background = '#28a745';
        button.textContent = 'Adicionado!';
        
        setTimeout(() => {
            button.style.background = originalBg;
            button.textContent = originalText;
        }, 1500);
    }

    updateCart() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (cartCount) cartCount.textContent = this.cart.length;
        
        this.cartTotal = this.cart.reduce((sum, item) => sum + item.price, 0);
        
        if (cartItems) {
            cartItems.innerHTML = this.cart.map((item, index) => {
                // Sanitize item data to prevent XSS
                const safeName = String(item.name || '').replace(/[<>"'&]/g, '');
                const safeSize = String(item.size || '').replace(/[<>"'&]/g, '');
                const safeMilk = String(item.milk || '').replace(/[<>"'&]/g, '');
                const safeQuantity = parseInt(item.quantity) || 0;
                const safePrice = parseFloat(item.price) || 0;
                
                return `
                    <div class="cart-item">
                        <div>
                            <strong>${safeName}</strong><br>
                            <small>${safeSize} | ${safeMilk} | Qtd: ${safeQuantity}</small>
                        </div>
                        <div>
                            <span>R$ ${safePrice.toFixed(2).replace('.', ',')}</span>
                            <button onclick="menuSystem.removeFromCart(${index})" class="remove-btn">×</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `Total: R$ ${this.cartTotal.toFixed(2).replace('.', ',')}`;
        }
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCart();
        this.saveCart();
    }

    toggleCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        }
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('coffeeShopCart', JSON.stringify(this.cart));
    }

    loadCart() {
        const savedCart = localStorage.getItem('coffeeShopCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCart();
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showMessage('Seu carrinho está vazio!', 'warning');
            return;
        }
        
        const currentUser = window.authSystem?.getCurrentUser();
        if (!currentUser) {
            this.showMessage('Faça login para finalizar seu pedido!', 'warning');
            window.authSystem?.openLogin();
            return;
        }
        
        const orderSummary = this.cart.map(item => 
            `${item.name} (${item.size}, ${item.milk}) x${item.quantity} - R$ ${item.price.toFixed(2).replace('.', ',')}`
        ).join('\n');
        
        this.showMessage(`Pedido confirmado! Total: R$ ${this.cartTotal.toFixed(2).replace('.', ',')}. Entrega em 30-45 minutos!`, 'success');
        
        this.clearCart();
        this.toggleCart();
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#dc3545' : 
                                   type === 'success' ? '#28a745' : 
                                   type === 'warning' ? '#ffc107' : '#007bff';
        
        if (type === 'warning') messageEl.style.color = '#000';
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    updatePrice(selectElement) {
        const menuItem = selectElement.closest('.menu-item');
        const priceElement = menuItem.querySelector('.menu-price');
        const newPrice = selectElement.value;
        
        if (priceElement) {
            priceElement.textContent = `R$ ${parseFloat(newPrice).toFixed(2).replace('.', ',')}`;
        }
    }
}

// Initialize menu system
const menuSystem = new MenuSystem();

// Global functions for backward compatibility
window.showCategory = (category) => {
    const clickedElement = event ? event.target : null;
    menuSystem.showCategory(category, clickedElement);
};
window.addToCart = (button) => menuSystem.addToCart(button);
window.removeFromCart = (index) => menuSystem.removeFromCart(index);
window.toggleCart = () => menuSystem.toggleCart();
window.clearCart = () => menuSystem.clearCart();
window.checkout = () => menuSystem.checkout();