// Abacus Trainer Website - Interactive JavaScript
// Kid-Friendly, Fun, and Engaging

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFAQ();
    initAnimations();
    initSmoothScroll();
    initScrollEffects();
    initPricingToggle();
    initFAQSearch();
});

// Navigation
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// FAQ Toggle
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Pricing Toggle (Monthly/Yearly)
function initPricingToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    const pricePeriods = document.querySelectorAll('.price-period');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            
            // Update active state
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle prices
            if (period === 'yearly') {
                monthlyPrices.forEach(price => price.classList.add('hide'));
                yearlyPrices.forEach(price => {
                    price.classList.remove('hidden');
                    price.classList.add('show');
                });
                pricePeriods.forEach(period => {
                    period.textContent = '/year';
                });
            } else {
                monthlyPrices.forEach(price => price.classList.remove('hide'));
                yearlyPrices.forEach(price => {
                    price.classList.add('hidden');
                    price.classList.remove('show');
                });
                pricePeriods.forEach(period => {
                    period.textContent = '/month';
                });
            }
        });
    });
}

// Card Focus States for Mobile Scrolling
function initCardFocusStates() {
    const scrollableContainers = document.querySelectorAll(
        '.features-grid, .benefits-grid, .benefits-grid-all, .benefits-grid-center, .audience-grid, .steps-grid, .pricing-cards, .pricing-plans-grid'
    );
    
    scrollableContainers.forEach(container => {
        let isScrolling = false;
        let autoScrollInterval = null;
        
        container.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                
                // Remove previous focus
                container.querySelectorAll('.card-focused').forEach(card => {
                    card.classList.remove('card-focused');
                });
                
                // Find the card in view
                const cards = container.querySelectorAll(
                    '.feature-card, .benefit-card, .audience-card, .step-card, .pricing-card, .plan-card'
                );
                
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    
                    // Check if card is in center viewport
                    const cardCenter = rect.left + rect.width / 2;
                    const containerCenter = containerRect.left + containerRect.width / 2;
                    
                    if (Math.abs(cardCenter - containerCenter) < rect.width / 2) {
                        card.classList.add('card-focused');
                    }
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 150);
            }
        });
        
        // Initialize on load
        container.dispatchEvent(new Event('scroll'));
        
        // Circular scrolling for features grid (all screen sizes)
        if (container.classList.contains('features-grid')) {
            initCircularScrolling(container);
        }
        
        // Circular scrolling for pricing cards on mobile/tablet
        if (container.classList.contains('pricing-cards') && window.innerWidth <= 1024) {
            initCircularScrolling(container);
        }
        
        // Circular scrolling for pricing plans grid on mobile/tablet
        if (container.classList.contains('pricing-plans-grid') && window.innerWidth <= 1024) {
            initCircularScrolling(container);
        }
    });
}

// Circular/Infinite Scrolling for Features and Pricing
function initCircularScrolling(container) {
    // Select cards based on container type
    let cardSelector = '.feature-card';
    if (container.classList.contains('pricing-plans-grid')) {
        cardSelector = '.plan-card';
    } else if (container.classList.contains('pricing-cards')) {
        cardSelector = '.pricing-card';
    }
    
    const cards = container.querySelectorAll(cardSelector + ':not(.card-clone)');
    if (cards.length === 0) return;
    
    // Clone cards for seamless looping
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('card-clone');
        container.appendChild(clone);
    });
    
    let isUserScrolling = false;
    let scrollTimeout = null;
    let scrollSpeed = (container.classList.contains('pricing-plans-grid') || container.classList.contains('pricing-cards')) ? 0.8 : 1; // Slightly slower for pricing
    
    // Auto-scroll animation
    function autoScroll() {
        if (isUserScrolling) return;
        
        container.scrollLeft += scrollSpeed;
        
        // Check if we've scrolled past original content
        const originalWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= originalWidth) {
            container.scrollLeft = container.scrollLeft - originalWidth;
        }
    }
    
    // User interaction handlers
    container.addEventListener('touchstart', () => {
        isUserScrolling = true;
        if (scrollTimeout) clearInterval(scrollTimeout);
    });
    
    container.addEventListener('touchend', () => {
        setTimeout(() => {
            isUserScrolling = false;
            if (!scrollTimeout) {
                scrollTimeout = setInterval(autoScroll, 20);
            }
        }, 2000);
    });
    
    container.addEventListener('mousedown', () => {
        isUserScrolling = true;
        if (scrollTimeout) clearInterval(scrollTimeout);
    });
    
    container.addEventListener('mouseup', () => {
        setTimeout(() => {
            isUserScrolling = false;
            if (!scrollTimeout) {
                scrollTimeout = setInterval(autoScroll, 20);
            }
        }, 2000);
    });
    
    // Pause on hover
    container.addEventListener('mouseenter', () => {
        if (scrollTimeout) {
            clearInterval(scrollTimeout);
            scrollTimeout = null;
        }
    });
    
    container.addEventListener('mouseleave', () => {
        if (!isUserScrolling && !scrollTimeout) {
            scrollTimeout = setInterval(autoScroll, 20);
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset scroll position on resize
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = container.scrollLeft - container.scrollWidth / 2;
            }
        }, 250);
    });
    
    // Start auto-scroll after initial delay
    setTimeout(() => {
        if (!isUserScrolling && !scrollTimeout) {
            scrollTimeout = setInterval(autoScroll, 20);
        }
    }, 1500);
}

// FAQ Search
function initFAQSearch() {
    const searchInput = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                const matches = question.includes(searchTerm) || answer.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Hide/show parent sections if all items are hidden
            document.querySelectorAll('.faq-section').forEach(section => {
                const visibleItems = Array.from(section.querySelectorAll('.faq-item')).filter(
                    item => item.style.display !== 'none'
                );
                section.style.display = visibleItems.length > 0 || searchTerm === '' ? 'block' : 'none';
            });
        });
    }
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 140; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll Animations
function initScrollEffects() {
    const animatedElements = document.querySelectorAll('.benefit-card, .feature-card, .step-card, .audience-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// General Animations
function initAnimations() {
    // Add pulse animation to buttons on hover
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1s ease-in-out infinite';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
    
    // Add CSS for pulse animation
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        }, { passive: true });
    }
}

// Performance optimization - Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Close mobile menu on resize if needed
        const navMenu = document.getElementById('nav-menu');
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    }, 250);
}, { passive: true });

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });