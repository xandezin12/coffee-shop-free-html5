// Button Manager - Keyboard Navigation & Accessibility
class ButtonManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupLoadingStates();
    this.setupRippleEffect();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const activeElement = document.activeElement;
      
      // Enter/Space on buttons
      if ((e.key === 'Enter' || e.key === ' ') && 
          (activeElement.classList.contains('btn') || activeElement.role === 'button')) {
        e.preventDefault();
        activeElement.click();
      }

      // Tab navigation enhancement
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    if (e.shiftKey && focusedIndex === 0) {
      e.preventDefault();
      focusableElements[focusableElements.length - 1].focus();
    } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
      e.preventDefault();
      focusableElements[0].focus();
    }
  }

  setupLoadingStates() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (btn && btn.dataset.loading === 'true') {
        this.setLoading(btn, true);
      }
    });
  }

  setLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  setupRippleEffect() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn || btn.disabled) return;

      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.3s ease-out;
        pointer-events: none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 300);
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Utility methods
  static addAccessibilityAttributes(button, options = {}) {
    const {
      label = '',
      describedBy = '',
      expanded = null,
      controls = '',
      pressed = null
    } = options;

    if (label) button.setAttribute('aria-label', label);
    if (describedBy) button.setAttribute('aria-describedby', describedBy);
    if (expanded !== null) button.setAttribute('aria-expanded', expanded);
    if (controls) button.setAttribute('aria-controls', controls);
    if (pressed !== null) button.setAttribute('aria-pressed', pressed);
  }

  static createButton(text, className = 'btn-primary', options = {}) {
    const button = document.createElement('button');
    button.className = `btn ${className}`;
    // Sanitize text content to prevent XSS
    button.textContent = String(text).replace(/[<>"'&]/g, '');
    
    if (options.icon) {
      const icon = document.createElement('i');
      // Sanitize icon class name
      icon.className = String(options.icon).replace(/[<>"'&]/g, '');
      icon.setAttribute('aria-hidden', 'true');
      button.insertBefore(icon, button.firstChild);
    }

    this.addAccessibilityAttributes(button, options);
    return button;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new ButtonManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ButtonManager;
}