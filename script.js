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
        const eventDate = new Date('2025-10-11T10:00:00').getTime();
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

// Export functions for potential external use
window.RunningLights = {
    updateCountdown,
    formatTime,
    debounce,
    openLightbox,
    closeLightbox
};
