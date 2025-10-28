// Running Lights JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Countdown timer for October 11, 2025
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
                // Simulate form submission (replace with actual implementation)
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
                // Simulate form submission (replace with actual implementation)
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
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
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
        
        // Add click tracking for distance cards
        link.addEventListener('click', function(e) {
            const distanceName = this.querySelector('h3').textContent;
            console.log('Distance card clicked:', distanceName);
            // Track click event (implement with your analytics solution)
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
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
    
    // Add click tracking for analytics (placeholder)
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Track button clicks (implement with your analytics solution)
            console.log('CTA button clicked:', this.textContent);
        });
    });
    
    // Add click tracking for info buttons
    document.querySelectorAll('.info-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            console.log('Info button clicked:', buttonText);
            // Track info button clicks (implement with your analytics solution)
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
    
    // Console welcome message
    console.log('%c🏃‍♂️ Running Lights 2025 🏃‍♀️', 'color: #ffd700; font-size: 20px; font-weight: bold;');
    console.log('%cVälkommen till Sveriges mysigaste lopp!', 'color: #333; font-size: 14px;');
    
});

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
        this.isOpen = false;
        this.isLoading = false;
        
        this.initElements();
        this.loadData();
        this.bindEvents();
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
            // Embedded data to avoid CORS issues
            this.data = [
                {
                    "question": "När är Running Lights 2026?",
                    "answer": "Running Lights 2026 äger rum den 10 oktober 2026. Det är Sveriges mysigaste lopp som går under Lights in Alingsås ljusfestival.",
                    "keywords": ["datum", "när", "2026", "10 oktober", "tid"]
                },
                {
                    "question": "Vilka distanser finns det?",
                    "answer": "Vi erbjuder 6 olika distanser: Knatteloppet (300m), Energiloppet (600m), Ungdomsloppet (1660m), Stafett (3x1660m), 5km och 10km. Det finns något för alla åldrar och nivåer!",
                    "keywords": ["distanser", "lopp", "längd", "km", "meter", "knatteloppet", "energiloppet", "ungdomsloppet", "stafett"]
                },
                {
                    "question": "Hur anmäler jag mig?",
                    "answer": "Anmälan görs via RaceID på vår hemsida. Klicka på någon av anmälningsknapparna så kommer du direkt till anmälningsformuläret. Du kan också gå direkt till raceid.com/sv/races/13275/registration",
                    "keywords": ["anmälan", "registrering", "anmäla", "raceid", "hur"]
                },
                {
                    "question": "Var är start och mål?",
                    "answer": "Start och mål är vid Stora torget (Kungsgatan) i Alingsås centrum. Alla lopp startar och slutar på samma plats, vilket gör det enkelt för familj och vänner att heja på.",
                    "keywords": ["start", "mål", "stora torget", "kungsgatan", "alingsås", "var", "plats"]
                },
                {
                    "question": "Vilka starttider gäller?",
                    "answer": "Starttiderna är: Knatteloppet 16:00, Energiloppet 16:30, Ungdomsloppet 16:45, Stafett 17:05, 5km 18:00, 10km 19:00. Alla tider är på lördagen den 10 oktober.",
                    "keywords": ["starttider", "tider", "klockan", "när startar", "schema"]
                },
                {
                    "question": "Var hämtar jag startkuvertet?",
                    "answer": "Du kan hämta ditt startkuvert på två sätt: Fredag 9/10 kl 16:30-18:00 på Mjörnvallen, eller Lördag 10/10 från kl 13:00 på Estrad (Bryggerigatan 2). Senast 1 timme innan din start.",
                    "keywords": ["startkuvert", "hämta", "mjörnvallen", "estrad", "bryggerigatan", "när", "var"]
                },
                {
                    "question": "Kostar det något att delta?",
                    "answer": "Ja, det kostar att delta i Running Lights. Priserna varierar beroende på distans och när du anmäler dig. Tidig anmälan ger lägre pris. Se aktuella priser på RaceID.",
                    "keywords": ["pris", "kostnad", "kostar", "avgift", "pengar", "billigt"]
                },
                {
                    "question": "Kan barn delta?",
                    "answer": "Absolut! Vi har Knatteloppet (300m) för våra yngsta löpare och Energiloppet (600m) som är perfekt för juniorer. Running Lights är ett familjevänligt event där alla åldrar är välkomna.",
                    "keywords": ["barn", "knatteloppet", "energiloppet", "familj", "ålder", "juniorer", "yngsta"]
                },
                {
                    "question": "Vad är Lights in Alingsås?",
                    "answer": "Lights in Alingsås är Sveriges mest spektakulära ljusfestival som äger rum samtidigt som vårt lopp. Du springer genom magiskt upplysta miljöer och upplever Alingsås i ett helt nytt ljus!",
                    "keywords": ["lights in alingsås", "ljusfestival", "ljus", "festival", "upplyst", "magiskt"]
                },
                {
                    "question": "Är det en del av någon löparserie?",
                    "answer": "Ja! Running Lights är en del av Västsvenska löparcupen. För att delta i cupen krävs att du tävlar för en förening som tillhör Västergötlands friidrottsförbund.",
                    "keywords": ["västsvenska löparcupen", "löparserie", "cup", "förening", "västergötland", "friidrottsförbund"]
                },
                {
                    "question": "Finns det löparmässa?",
                    "answer": "Ja! Det finns en löparmässa med fri entré på Estrad mellan 10-18 på lördagen. Där finns utställare och allt för löpare. Mer info på loparmassan.se",
                    "keywords": ["löparmässa", "mässa", "utställare", "estrad", "fri entré", "lördag"]
                },
                {
                    "question": "Vad är After Run?",
                    "answer": "After Run är vårt efterfest som startar 19:00 efter loppet. Använd rabattkoden 'runninglights' så får du 15% rabatt. Perfekt för att fira din prestation!",
                    "keywords": ["after run", "efterfest", "fest", "19:00", "rabattkod", "runninglights", "rabatt"]
                },
                {
                    "question": "Hur kontaktar jag arrangörerna?",
                    "answer": "Du kan kontakta oss via info@runninglights.se eller ringa +46 (0) 709 71 19 06. Vi finns också på Alingsås IF kansli, Lövekullevägen 21, 441 44 Alingsås.",
                    "keywords": ["kontakt", "telefon", "email", "info@runninglights.se", "alingsås if", "lövekullevägen"]
                },
                {
                    "question": "Finns det parkeringsplatser?",
                    "answer": "Ja, det finns parkeringsmöjligheter i Alingsås centrum nära start/mål-området vid Stora torget. Vi rekommenderar att komma i god tid då det kan vara mycket folk under ljusfestivalen.",
                    "keywords": ["parkering", "bil", "parkeringsplatser", "centrum", "stora torget", "var parkera"]
                },
                {
                    "question": "Vad händer om det regnar?",
                    "answer": "Running Lights går av stapeln oavsett väder! Vi springer i regn och rusk. Klä dig efter vädret och kom förberedd. Loppet ställs endast in vid extrema väderförhållanden.",
                    "keywords": ["väder", "regn", "rusk", "ställs in", "klädsel", "oavsett väder"]
                }
            ];
            
            // Initialize Fuse.js for fuzzy search
            this.fuse = new Fuse(this.data, {
                keys: ['question', 'answer', 'keywords'],
                threshold: 0.4,
                includeScore: true,
                minMatchCharLength: 2
            });
            
            console.log('Chatbot data loaded successfully');
        } catch (error) {
            console.error('Error loading chatbot data:', error);
            this.addBotMessage('Ursäkta, jag har problem att ladda min kunskapsbas just nu. Försök igen senare eller kontakta oss direkt.');
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
        
        // Simulate thinking time
        await this.delay(800 + Math.random() * 1200);
        
        // Search for answer
        const answer = this.searchAnswer(message);
        
        // Remove typing indicator and add bot response
        this.hideTypingIndicator();
        this.addBotMessage(answer);
        this.isLoading = false;
    }
    
    searchAnswer(query) {
        if (!this.fuse) {
            return 'Ursäkta, jag laddar fortfarande min kunskapsbas. Försök igen om ett ögonblick.';
        }
        
        // Search using Fuse.js
        const results = this.fuse.search(query);
        
        if (results.length > 0 && results[0].score < 0.6) {
            return results[0].item.answer;
        }
        
        // No good match found
        return this.getDefaultResponse(query);
    }
    
    getDefaultResponse(query) {
        const defaultResponses = [
            'Hmm, jag är inte säker på det. Kan du formulera frågan på ett annat sätt? Du kan fråga om datum, anmälan, distanser, starttider eller annat om Running Lights.',
            'Jag förstod inte riktigt din fråga. Försök fråga om något specifikt som "När är loppet?" eller "Hur anmäler jag mig?"',
            'Tyvärr kan jag inte svara på det just nu. Kontakta oss gärna på info@runninglights.se eller +46 (0) 709 71 19 06 för mer hjälp!',
            'Jag är fortfarande ganska ny, så jag kanske inte förstår allt. Kan du prova att fråga om anmälan, datum, distanser eller starttider?'
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
        messageEl.innerHTML = `
            <div class="message-avatar">🏃‍♂️</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
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
    
    // Countdown timer for October 11, 2025
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
    
    console.log('%c🏃‍♂️ Running Lights 2025 🏃‍♀️', 'color: #ffd700; font-size: 20px; font-weight: bold;');
    console.log('%cVälkommen till Sveriges mysigaste lopp!', 'color: #333; font-size: 14px;');
}

// Export functions for potential external use
window.RunningLights = {
    updateCountdown,
    formatTime,
    debounce,
    openLightbox,
    closeLightbox
};
