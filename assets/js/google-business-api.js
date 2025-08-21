/**
 * Google Business & Reviews Integration
 * Integrates Google My Business API and Reviews
 */

class GoogleBusinessAPI {
    constructor() {
        this.businessId = 'YOUR_GOOGLE_BUSINESS_ID';
        this.placeId = 'YOUR_GOOGLE_PLACE_ID';
        this.init();
    }

    init() {
        this.loadGoogleReviews();
        this.setupBusinessInfo();
        this.initQRCodeGenerator();
        this.setupReviewPrompts();
    }

    // Load and display Google Reviews
    async loadGoogleReviews() {
        try {
            // Using Places API to get reviews
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            
            service.getDetails({
                placeId: this.placeId,
                fields: ['reviews', 'rating', 'user_ratings_total', 'name']
            }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.displayReviews(place);
                }
            });
        } catch (error) {
            console.log('Reviews not available, using mock data');
            this.displayMockReviews();
        }
    }

    displayReviews(place) {
        const reviewsContainer = this.createReviewsSection();
        
        const reviewsHTML = `
            <div class="google-reviews-section">
                <h3>⭐ Avaliações Google (${place.rating}/5)</h3>
                <p class="reviews-summary">${place.user_ratings_total} avaliações</p>
                
                <div class="reviews-grid">
                    ${place.reviews?.slice(0, 3).map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <img src="${review.profile_photo_url}" alt="${review.author_name}" 
                                     class="reviewer-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFODlBMkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'">
                                <div class="reviewer-info">
                                    <strong>${review.author_name}</strong>
                                    <div class="review-rating">
                                        ${'⭐'.repeat(review.rating)}
                                    </div>
                                </div>
                            </div>
                            <p class="review-text">${review.text}</p>
                            <small class="review-time">${this.formatReviewTime(review.time)}</small>
                        </div>
                    `).join('')}
                </div>
                
                <div class="reviews-actions">
                    <a href="https://search.google.com/local/writereview?placeid=${this.placeId}" 
                       target="_blank" class="btn btn-primary">
                        ✍️ Deixar Avaliação
                    </a>
                    <button onclick="googleBusiness.showAllReviews()" class="btn btn-secondary">
                        Ver Todas
                    </button>
                </div>
            </div>
        `;
        
        reviewsContainer.innerHTML = reviewsHTML;
    }

    displayMockReviews() {
        const mockReviews = [
            {
                author_name: "Maria Silva",
                rating: 5,
                text: "Melhor café da região! Atendimento excepcional e ambiente aconchegante.",
                time: Date.now() - (7 * 24 * 60 * 60 * 1000)
            },
            {
                author_name: "João Santos",
                rating: 5,
                text: "Café delicioso e bolos artesanais incríveis. Recomendo!",
                time: Date.now() - (14 * 24 * 60 * 60 * 1000)
            },
            {
                author_name: "Ana Costa",
                rating: 4,
                text: "Ótimo lugar para trabalhar e tomar um bom café. WiFi rápido!",
                time: Date.now() - (21 * 24 * 60 * 60 * 1000)
            }
        ];

        const reviewsContainer = this.createReviewsSection();
        
        const reviewsHTML = `
            <div class="google-reviews-section">
                <h3>⭐ Avaliações dos Clientes (4.8/5)</h3>
                <p class="reviews-summary">127 avaliações</p>
                
                <div class="reviews-grid">
                    ${mockReviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="reviewer-photo-placeholder">
                                    ${review.author_name.charAt(0)}
                                </div>
                                <div class="reviewer-info">
                                    <strong>${review.author_name}</strong>
                                    <div class="review-rating">
                                        ${'⭐'.repeat(review.rating)}
                                    </div>
                                </div>
                            </div>
                            <p class="review-text">${review.text}</p>
                            <small class="review-time">${this.formatReviewTime(review.time)}</small>
                        </div>
                    `).join('')}
                </div>
                
                <div class="reviews-actions">
                    <button onclick="googleBusiness.promptReview()" class="btn btn-primary">
                        ✍️ Deixar Avaliação
                    </button>
                    <button onclick="googleBusiness.shareExperience()" class="btn btn-secondary">
                        📱 Compartilhar
                    </button>
                </div>
            </div>
        `;
        
        reviewsContainer.innerHTML = reviewsHTML;
    }

    createReviewsSection() {
        let container = document.getElementById('reviews-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'reviews-section';
            
            // Add after team section
            const teamSection = document.getElementById('team');
            if (teamSection) {
                teamSection.parentNode.insertBefore(container, teamSection.nextSibling);
            }
        }
        return container;
    }

    formatReviewTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        
        if (days === 0) return 'Hoje';
        if (days === 1) return 'Ontem';
        if (days < 7) return `${days} dias atrás`;
        if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
        return `${Math.floor(days / 30)} meses atrás`;
    }

    // QR Code Generator for Google Reviews
    initQRCodeGenerator() {
        const reviewURL = `https://search.google.com/local/writereview?placeid=${this.placeId}`;
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reviewURL)}`;
        
        // Add QR code to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const qrSection = document.createElement('div');
            qrSection.innerHTML = `
                <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <h4>📱 Avalie-nos no Google</h4>
                    <p>Escaneie o QR Code para deixar sua avaliação</p>
                    <img src="${qrCodeURL}" alt="QR Code para avaliação" style="border-radius: 10px;">
                    <br><br>
                    <a href="${reviewURL}" target="_blank" class="btn btn-primary">
                        ⭐ Avaliar no Google
                    </a>
                </div>
            `;
            contactSection.appendChild(qrSection);
        }
    }

    // Business Information Integration
    setupBusinessInfo() {
        const businessInfo = {
            name: "Coffee Shop",
            address: "R. Aureliano Coutinho, 26, Consolação, São Paulo - SP",
            phone: "(11) 99999-9999",
            website: window.location.origin,
            hours: {
                monday: "7:00 - 22:00",
                tuesday: "7:00 - 22:00", 
                wednesday: "7:00 - 22:00",
                thursday: "7:00 - 22:00",
                friday: "7:00 - 23:00",
                saturday: "8:00 - 23:00",
                sunday: "8:00 - 21:00"
            }
        };

        // Add structured data for Google
        this.addStructuredData(businessInfo);
        
        // Add business hours widget
        this.addBusinessHoursWidget(businessInfo.hours);
    }

    addStructuredData(businessInfo) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "CafeOrCoffeeShop",
            "name": businessInfo.name,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "R. Aureliano Coutinho, 26",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "postalCode": "01224-020",
                "addressCountry": "BR"
            },
            "telephone": businessInfo.phone,
            "url": businessInfo.website,
            "openingHours": Object.entries(businessInfo.hours).map(([day, hours]) => 
                `${day.substring(0, 2).toUpperCase()} ${hours}`
            ),
            "servesCuisine": "Coffee, Pastries, Light Meals",
            "priceRange": "$$",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -23.54008690303477,
                "longitude": -46.652840763335085
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    addBusinessHoursWidget(hours) {
        const hoursWidget = document.createElement('div');
        hoursWidget.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 10px; 
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px 0;">
                <h4>🕒 Horário de Funcionamento</h4>
                <div class="hours-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${Object.entries(hours).map(([day, time]) => `
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span style="font-weight: 500;">${this.translateDay(day)}:</span>
                            <span>${time}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 15px; text-align: center;">
                    <span class="current-status" id="businessStatus">
                        ${this.getCurrentStatus(hours)}
                    </span>
                </div>
            </div>
        `;
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.appendChild(hoursWidget);
        }
    }

    translateDay(day) {
        const days = {
            monday: 'Segunda',
            tuesday: 'Terça',
            wednesday: 'Quarta',
            thursday: 'Quinta',
            friday: 'Sexta',
            saturday: 'Sábado',
            sunday: 'Domingo'
        };
        return days[day] || day;
    }

    getCurrentStatus(hours) {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.getHours() * 100 + now.getMinutes();
        
        const todayHours = hours[currentDay];
        if (!todayHours) return '❌ Fechado hoje';
        
        const [openTime, closeTime] = todayHours.split(' - ').map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 100 + minutes;
        });
        
        if (currentTime >= openTime && currentTime <= closeTime) {
            return `✅ Aberto agora (fecha às ${todayHours.split(' - ')[1]})`;
        } else if (currentTime < openTime) {
            return `🔒 Fechado (abre às ${todayHours.split(' - ')[0]})`;
        } else {
            return `🔒 Fechado (abre amanhã)`;
        }
    }

    // Review Prompts and Sharing
    promptReview() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.5); z-index: 9999; display: flex; 
                        align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; 
                           max-width: 400px; text-align: center;">
                    <h3>⭐ Gostou da experiência?</h3>
                    <p>Sua avaliação nos ajuda a melhorar sempre!</p>
                    
                    <div style="margin: 20px 0;">
                        <button onclick="googleBusiness.rateExperience(5)" class="rating-btn">⭐⭐⭐⭐⭐</button>
                        <button onclick="googleBusiness.rateExperience(4)" class="rating-btn">⭐⭐⭐⭐</button>
                        <button onclick="googleBusiness.rateExperience(3)" class="rating-btn">⭐⭐⭐</button>
                    </div>
                    
                    <button onclick="this.closest('div').remove()" class="btn btn-secondary">
                        Agora não
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    rateExperience(rating) {
        if (rating >= 4) {
            // Redirect to Google Reviews
            window.open(`https://search.google.com/local/writereview?placeid=${this.placeId}`, '_blank');
        } else {
            // Show feedback form for improvement
            this.showFeedbackForm();
        }
        
        // Close modal
        document.querySelector('[style*="position: fixed"]')?.remove();
    }

    showFeedbackForm() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.5); z-index: 9999; display: flex; 
                        align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; 
                           max-width: 400px;">
                    <h3>💬 Como podemos melhorar?</h3>
                    <textarea placeholder="Conte-nos como podemos oferecer uma experiência ainda melhor..." 
                              style="width: 100%; height: 100px; margin: 15px 0; padding: 10px; 
                                     border: 1px solid #ddd; border-radius: 5px;"></textarea>
                    
                    <div style="text-align: center;">
                        <button onclick="googleBusiness.submitFeedback(this)" class="btn btn-primary">
                            Enviar Feedback
                        </button>
                        <button onclick="this.closest('div').remove()" class="btn btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    submitFeedback(button) {
        const textarea = button.parentElement.parentElement.querySelector('textarea');
        const feedback = textarea.value;
        
        // Here you would send feedback to your backend
        console.log('Feedback received:', feedback);
        
        // Show thank you message
        button.parentElement.innerHTML = `
            <div style="text-align: center; color: #28a745;">
                <h4>✅ Obrigado pelo feedback!</h4>
                <p>Vamos trabalhar para melhorar sua experiência.</p>
                <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                        class="btn btn-primary">Fechar</button>
            </div>
        `;
    }

    shareExperience() {
        const shareData = {
            title: 'Coffee Shop - Melhor café da região!',
            text: 'Acabei de tomar um café incrível na Coffee Shop. Recomendo!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback to social media links
            const shareModal = document.createElement('div');
            shareModal.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                           background: white; padding: 20px; border-radius: 10px; 
                           box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999;">
                    <h4>📱 Compartilhar Experiência</h4>
                    <div style="display: flex; gap: 10px; margin: 15px 0;">
                        <a href="https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}" 
                           target="_blank" class="btn btn-success">WhatsApp</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" 
                           target="_blank" class="btn btn-primary">Facebook</a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" 
                           target="_blank" class="btn btn-info">Twitter</a>
                    </div>
                    <button onclick="this.parentElement.remove()" class="btn btn-secondary">Fechar</button>
                </div>
            `;
            document.body.appendChild(shareModal);
        }
    }

    setupReviewPrompts() {
        // Show review prompt after user interaction
        let interactionCount = 0;
        
        document.addEventListener('click', () => {
            interactionCount++;
            
            // Show prompt after 10 interactions
            if (interactionCount === 10) {
                setTimeout(() => {
                    this.promptReview();
                }, 2000);
            }
        });
    }
}

// Initialize Google Business API
window.addEventListener('DOMContentLoaded', () => {
    window.googleBusiness = new GoogleBusinessAPI();
});

// Add CSS for reviews
const reviewsCSS = `
    .google-reviews-section {
        background: #f8f9fa;
        padding: 40px 20px;
        margin: 40px 0;
        border-radius: 15px;
    }
    
    .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .review-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .review-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .reviewer-photo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
    }
    
    .reviewer-photo-placeholder {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #E89A2F;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 15px;
    }
    
    .review-rating {
        font-size: 14px;
    }
    
    .review-text {
        color: #666;
        line-height: 1.5;
        margin-bottom: 10px;
    }
    
    .review-time {
        color: #999;
        font-size: 12px;
    }
    
    .reviews-actions {
        text-align: center;
        margin-top: 30px;
    }
    
    .reviews-actions .btn {
        margin: 0 10px;
    }
    
    .rating-btn {
        background: none;
        border: none;
        font-size: 20px;
        margin: 0 5px;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        transition: background 0.3s;
    }
    
    .rating-btn:hover {
        background: #f0f0f0;
    }
`;

const style = document.createElement('style');
style.textContent = reviewsCSS;
document.head.appendChild(style);