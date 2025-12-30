// Running Lights JavaScript

// Import transformers.js for semantic search
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Configure transformers.js to use CDN models
env.allowLocalModels = false;

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Utility functions
function formatTime(time) {
    return time.toString().padStart(2, '0');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lightbox functionality for maps
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    // Get the high-resolution image path
    const largeImageSrc = imgElement.getAttribute('data-large');
    const altText = imgElement.getAttribute('alt');
    
    // Set the lightbox image
    lightboxImage.src = largeImageSrc;
    lightboxImage.alt = altText;
    lightboxCaption.textContent = altText;
    
    // Show the lightbox
    lightbox.style.display = 'block';
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
    
    // Remove escape key listener
    document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
}

// Prevent lightbox from closing when clicking on the image
document.addEventListener('DOMContentLoaded', function() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) {
        lightboxImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// Chatbot functionality
class RunningLightsChatbot {
    constructor() {
        this.data = [];
        this.fuse = null;
        this.embedder = null;
        this.embeddings = [];
        this.isOpen = false;
        this.isLoading = false;
        this.useEmbeddings = false;
        this.modelLoading = false;
        
        this.initElements();
        this.loadData();
        this.bindEvents();
        this.initEmbeddings();
    }
    
    initElements() {
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.chatIcon = this.toggle.querySelector('.chatbot-icon');
        this.closeIcon = this.toggle.querySelector('.close-icon');
    }
    
    async loadData() {
        try {
            // Load data from external JSON file
            const response = await fetch('chatbot-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            
            // Initialize Fuse.js for fuzzy search
            this.fuse = new Fuse(this.data, {
                keys: [
                    { name: 'question', weight: 2 },
                    { name: 'keywords', weight: 1.5 },
                    { name: 'answer', weight: 0.5 }
                ],
                threshold: 0.5,
                includeScore: true,
                minMatchCharLength: 2,
                ignoreLocation: true
            });
            
            console.log('Chatbot data loaded successfully from JSON file');
        } catch (error) {
            console.error('Error loading chatbot data:', error);
            this.addBotMessage('Ursäkta, jag har problem att ladda min kunskapsbas just nu. Försök igen senare eller kontakta oss direkt.');
        }
    }
    
    async initEmbeddings() {
        try {
            this.modelLoading = true;
            console.log('Loading semantic search model...');
            
            // Load the embedding model (small and fast)
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            console.log('Generating embeddings for FAQ...');
            // Pre-compute embeddings for all questions and keywords
            this.embeddings = await Promise.all(
                this.data.map(async (item) => {
                    // Combine question and keywords for better matching
                    const text = `${item.question} ${item.keywords.join(' ')}`;
                    const output = await this.embedder(text, { pooling: 'mean', normalize: true });
                    return Array.from(output.data);
                })
            );
            
            this.useEmbeddings = true;
            this.modelLoading = false;
            console.log('✓ Semantic search ready! Chatbot is now super smart 🧠');
        } catch (error) {
            console.warn('Could not load embeddings model, falling back to Fuse.js:', error);
            this.useEmbeddings = false;
            this.modelLoading = false;
        }
    }
    
    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat();
            }
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.window.classList.remove('hidden');
            setTimeout(() => {
                this.window.classList.add('show');
                this.input.focus();
            }, 10);
            this.chatIcon.classList.add('hidden');
            this.closeIcon.classList.remove('hidden');
            
            // Show status if model is loading
            if (this.modelLoading && this.messages.children.length === 1) {
                this.addBotMessage('⏳ Laddar smart sökmotor i bakgrunden... Du kan ställa frågor medan den laddar!');
            } else if (this.useEmbeddings && this.messages.children.length === 1) {
                this.addBotMessage('🧠 Smart sökning aktiverad! Jag förstår nu dina frågor bättre än någonsin.');
            }
        } else {
            this.window.classList.remove('show');
            setTimeout(() => {
                this.window.classList.add('hidden');
            }, 300);
            this.chatIcon.classList.remove('hidden');
            this.closeIcon.classList.add('hidden');
        }
    }
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message
        this.addUserMessage(message);
        this.input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        this.isLoading = true;
        
        // Simulate thinking time (shorter if using embeddings)
        const thinkTime = this.useEmbeddings ? 300 + Math.random() * 500 : 800 + Math.random() * 1200;
        await this.delay(thinkTime);
        
        // Search for answer (now async)
        const answer = await this.searchAnswer(message);
        
        // Remove typing indicator and add bot response
        this.hideTypingIndicator();
        this.addBotMessage(answer);
        this.isLoading = false;
    }
    
    async searchAnswer(query) {
        // If embeddings are ready, use semantic search
        if (this.useEmbeddings && this.embedder && this.embeddings.length > 0) {
            return await this.semanticSearch(query);
        }
        
        // Fall back to Fuse.js
        return this.fuzzySearch(query);
    }
    
    async semanticSearch(query) {
        try {
            // Generate embedding for user query
            const output = await this.embedder(query, { pooling: 'mean', normalize: true });
            const queryEmbedding = Array.from(output.data);
            
            // Calculate similarity with all FAQ embeddings
            const similarities = this.embeddings.map((embedding, index) => ({
                index,
                similarity: cosineSimilarity(queryEmbedding, embedding),
                item: this.data[index]
            }));
            
            // Sort by similarity (highest first)
            similarities.sort((a, b) => b.similarity - a.similarity);
            
            // Debug logging
            console.log('🧠 Semantic search - Best match:', similarities[0].similarity.toFixed(3), 'for query:', query);
            console.log('   Matched question:', similarities[0].item.question);
            
            // If similarity is high enough, return the answer
            // Using 0.55 threshold to avoid false matches
            if (similarities[0].similarity > 0.55) {
                return similarities[0].item.answer;
            }
            
            // No good match found
            return this.getDefaultResponse(query);
        } catch (error) {
            console.error('Error in semantic search:', error);
            // Fall back to Fuse.js
            return this.fuzzySearch(query);
        }
    }
    
    fuzzySearch(query) {
        if (!this.fuse) {
            return 'Ursäkta, jag laddar fortfarande min kunskapsbas. Försök igen om ett ögonblick.';
        }
        
        // Search using Fuse.js
        const results = this.fuse.search(query);
        
        // Debug logging
        if (results.length > 0) {
            console.log('📝 Fuzzy search - Best match score:', results[0].score, 'for query:', query);
        }
        
        if (results.length > 0 && results[0].score < 0.7) {
            return results[0].item.answer;
        }
        
        // No good match found
        return this.getDefaultResponse(query);
    }
    
    getDefaultResponse(query) {
        const suggestions = [
            '• När är loppet?',
            '• Hur anmäler jag mig?',
            '• Vilka distanser finns?',
            '• Vad kostar det?',
            '• Var hämtar jag nummerlappen?',
            '• Finns det medaljer?'
        ];
        
        const defaultResponses = [
            `Hmm, jag är inte säker på hur jag ska svara på det. Här är några saker jag kan hjälpa till med:\n\n${suggestions.join('\n')}\n\nFråga gärna något av dessa eller kontakta oss på info@runninglights.se`,
            `Jag förstod inte riktigt din fråga. Prova att fråga mer specifikt, till exempel:\n\n${suggestions.slice(0, 3).join('\n')}\n\nEller maila info@runninglights.se för mer hjälp!`,
            `Tyvärr kan jag inte svara på det just nu. Du kan fråga om:\n\n${suggestions.slice(0, 4).join('\n')}\n\nEller kontakta oss på info@runninglights.se`,
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    addUserMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        messageEl.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.messages.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message';
        // Convert newlines to <br> tags for proper formatting
        const formattedMessage = this.escapeHtml(message).replace(/\n/g, '<br>');
        messageEl.innerHTML = `
            <div class="message-avatar">🏃‍♂️</div>
            <div class="message-content">
                <p>${formattedMessage}</p>
            </div>
        `;
        this.messages.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot-message typing-message';
        typingEl.innerHTML = `
            <div class="message-avatar">🏃‍♂️</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messages.appendChild(typingEl);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingMessage = this.messages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality first
    initializeExistingFunctionality();
    
    // Initialize chatbot
    window.chatbot = new RunningLightsChatbot();
});

// Move existing DOMContentLoaded code to separate function
function initializeExistingFunctionality() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Countdown timer for October 10, 2026
    function updateCountdown() {
        const eventDate = new Date('2026-10-10T10:00:00').getTime();
        const now = new Date().getTime();
        const timeLeft = eventDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update countdown elements
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // Remove loading class if present
            document.querySelectorAll('.countdown-item').forEach(item => {
                item.classList.remove('loading');
            });
        } else {
            // Event has passed
            document.querySelectorAll('.countdown-item span').forEach(span => {
                span.textContent = '00';
            });
        }
    }
    
    // Initialize countdown
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                alert('Tack för din anmälan till vårt nyhetsbrev! Vi kommer att kontakta dig snart.');
                this.reset();
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (name && email && subject && message) {
                alert('Tack för ditt meddelande! Vi återkommer till dig inom kort.');
                this.reset();
            }
        });
    }
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.distance-card, .feature, .countdown-item, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.backgroundPosition = `center ${speed}px`;
        }
    });
    
    // Add loading states
    document.querySelectorAll('.countdown-item').forEach(item => {
        item.classList.add('loading');
    });
    
    // Remove loading states after countdown initializes
    setTimeout(() => {
        document.querySelectorAll('.countdown-item').forEach(item => {
            item.classList.remove('loading');
        });
    }, 1000);
    
    // Add hover effects for distance cards
    document.querySelectorAll('.distance-card-link').forEach(link => {
        const card = link.querySelector('.distance-card');
        
        link.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        link.addEventListener('click', function(e) {
            const distanceName = this.querySelector('h3').textContent;
            console.log('Distance card clicked:', distanceName);
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
    
    // Add focus management for mobile menu
    if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Performance optimization: lazy load images when they come into view
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add click tracking for analytics
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('CTA button clicked:', this.textContent);
        });
    });
    
    document.querySelectorAll('.info-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            console.log('Info button clicked:', buttonText);
        });
    });
    
    // Add form validation feedback
    function addFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#ff6b6b';
                    this.style.boxShadow = '0 0 5px rgba(255, 107, 107, 0.3)';
                } else {
                    this.style.borderColor = '#28a745';
                    this.style.boxShadow = '0 0 5px rgba(40, 167, 69, 0.3)';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#28a745';
                    this.style.boxShadow = '0 0 5px rgba(40, 167, 69, 0.3)';
                }
            });
        });
    }
    
    // Apply form validation to all forms
    document.querySelectorAll('form').forEach(addFormValidation);
    
    console.log('%c🏃‍♂️ Running Lights 2026 🏃‍♀️', 'color: #ffd700; font-size: 20px; font-weight: bold;');
    console.log('%cVälkommen till Sveriges mysigaste lopp!', 'color: #333; font-size: 14px;');
}

// Export functions for potential external use
window.RunningLights = {
    openLightbox,
    closeLightbox
};
