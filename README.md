# Coffee Shop Website - Multilingual & Secure

A modern, secure, and multilingual coffee shop website with comprehensive security measures and internationalization support.

## 🌟 Features

### 🌍 Multilingual Support
- **4 Languages**: Portuguese (default), English, Spanish, French
- **Dynamic Language Switching**: Real-time content translation
- **Persistent Language Selection**: Remembers user's language preference
- **Comprehensive Translation**: All UI elements, messages, and content

### 🔒 Security Features
- **Input Validation & Sanitization**: Prevents XSS and injection attacks
- **Secure Authentication**: Password hashing, rate limiting, timing-safe comparisons
- **Content Security Policy**: Prevents code injection and XSS
- **Security Headers**: X-Frame-Options, X-XSS-Protection, etc.
- **Environment-based Configuration**: No hardcoded credentials
- **Session Management**: Secure storage with automatic cleanup

### ☕ Coffee Shop Features
- **Interactive Menu**: Customizable orders with size and milk options
- **Shopping Cart**: Add, remove, and customize items
- **User Authentication**: Secure registration and login system
- **Event Booking**: Special events and catering requests
- **Team Profiles**: Meet the coffee shop team
- **Location Map**: Interactive map with user location
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

1. **Clone or Download** the project files
2. **Set up Environment** (optional for basic usage):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
3. **Open in Browser**: Open `index.html` in your web browser
4. **Language Selection**: Use the 🌐 button in the navigation to switch languages

## 📁 Project Structure

```
coffee-shop-free-html5-template/
├── assets/
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   │   ├── auth-system.js   # Secure authentication
│   │   ├── security-manager.js # Security utilities
│   │   ├── language-manager.js # Internationalization
│   │   ├── menu-system.js   # Interactive menu
│   │   └── events-system.js # Event booking
│   ├── img/                 # Images and assets
│   └── fonts/               # Font files
├── languages/               # Language packs
│   ├── pt.js               # Portuguese (default)
│   ├── en.js               # English
│   ├── es.js               # Spanish
│   └── fr.js               # French
├── config/
│   └── config.js           # Application configuration
├── admin/                  # Admin panel (if needed)
├── .env.example           # Environment variables template
├── SECURITY.md            # Security documentation
└── index.html             # Main application file
```

## 🌍 Language Support

### Supported Languages:
- 🇧🇷 **Portuguese** (pt) - Default
- 🇺🇸 **English** (en)
- 🇪🇸 **Spanish** (es)
- 🇫🇷 **French** (fr)

### Adding New Languages:
1. Create a new language file in `languages/` (e.g., `de.js` for German)
2. Follow the structure of existing language files
3. Add the language code to `supportedLanguages` in `language-manager.js`
4. Add the language option to the language selector

## 🔒 Security Implementation

### Key Security Features:
- **XSS Prevention**: All user inputs sanitized
- **CSRF Protection**: Secure form handling
- **Rate Limiting**: Prevents brute force attacks
- **Secure Storage**: Encrypted local storage
- **Password Security**: Strong password requirements and hashing
- **Content Security Policy**: Prevents code injection

### Security Headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## ⚙️ Configuration

### Environment Variables:
Copy `.env.example` to `.env` and configure:

```env
# Contact Information
COFFEE_SHOP_EMAIL=your-email@domain.com
COFFEE_SHOP_PHONE=your-phone-number

# Social Media
FACEBOOK_URL=https://facebook.com/yourpage
INSTAGRAM_URL=https://instagram.com/yourpage

# Security
COFFEE_SHOP_SALT=your-secure-salt-key
```

### Application Settings:
Edit `config/config.js` for:
- Business information
- Menu categories
- Staff details
- Operating hours
- Security settings

## 🛠️ Development

### Prerequisites:
- Modern web browser
- Text editor or IDE
- Local web server (optional, for development)

### Development Setup:
1. Clone the repository
2. Set up environment variables
3. Use a local server for development:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

### Code Quality:
- ESLint configuration for JavaScript
- Security-first development practices
- Comprehensive error handling
- Input validation on all forms

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization

### Styling:
- Edit CSS files in `assets/css/`
- Customize colors, fonts, and layout
- Responsive design built-in

### Content:
- Update language files for text content
- Modify `config/config.js` for business details
- Replace images in `assets/img/`

### Features:
- Add new menu items in the menu system
- Customize form fields and validation
- Extend the authentication system

## 🚀 Deployment

### Production Checklist:
- [ ] Set up environment variables
- [ ] Configure security headers at server level
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Test all security features
- [ ] Verify all languages work correctly
- [ ] Set up monitoring and logging

### Recommended Hosting:
- Static hosting: Netlify, Vercel, GitHub Pages
- Traditional hosting: Apache, Nginx
- CDN: CloudFlare for performance and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially security features)
5. Submit a pull request

### Security Contributions:
- Report security issues privately
- Follow secure coding practices
- Test security features thoroughly

## 📄 License

This project is open source. Please check the license file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review security guidelines
- Create an issue for bugs
- Contact the development team for security issues

## 🔄 Updates

### Version 2.0 Features:
- ✅ Multilingual support (4 languages)
- ✅ Comprehensive security implementation
- ✅ Secure authentication system
- ✅ Input validation and sanitization
- ✅ Environment-based configuration
- ✅ Security headers and CSP
- ✅ Rate limiting and session management

### Planned Features:
- Backend API integration
- Payment processing
- Advanced admin panel
- Email notifications
- Social media integration
- Analytics dashboard

---

**Made with ☕ and 🔒 by the Coffee Shop Team**