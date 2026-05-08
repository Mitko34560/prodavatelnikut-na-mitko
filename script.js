// ============================================
// ПРОДАВАТЕЛНИКЪТ НА МИТКО - JAVASCRIPT
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollProgress();
    initLoadingScreen();
    initNavigation();
    initParticles();
    initScrollAnimations();
    initStatCounter();
    initPortfolioFilters();
    initFormSubmission();
    initSmoothScroll();
});

// ============================================
// CUSTOM CURSOR
// ============================================

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorShadow = document.querySelector('.cursor-shadow');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';

        setTimeout(() => {
            cursorShadow.style.left = mouseX - 15 + 'px';
            cursorShadow.style.top = mouseY - 15 + 'px';
        }, 50);
    });

    // Hide cursor on mobile
    if (window.innerWidth < 768) {
        cursor.style.display = 'none';
        cursorShadow.style.display = 'none';
    }
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ============================================
// LOADING SCREEN
// ============================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after animation completes
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 26, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 15, 26, 0.8)';
        }
    });
}

// ============================================
// FLOATING PARTICLES
// ============================================

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 10 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 10 + 20;
        const delay = Math.random() * 5;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.service-card, .why-card, .review-card, .portfolio-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ============================================
// STAT COUNTER ANIMATION
// ============================================

function initStatCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounter = () => {
        if (hasAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 60;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });

        hasAnimated = true;
    };

    // Trigger animation when section comes into view
    const aboutSection = document.getElementById('about');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounter();
            observer.unobserve(aboutSection);
        }
    }, { threshold: 0.5 });

    observer.observe(aboutSection);
}

// ============================================
// PORTFOLIO FILTERS
// ============================================

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '1';
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                }
            });
        });
    });
}

// ============================================
// FORM SUBMISSION
// ============================================

function initFormSubmission() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            project: document.getElementById('project').value,
            message: document.getElementById('message').value,
            budget: document.getElementById('budget').value
        };

        // Validate
        if (!formData.name || !formData.email || !formData.project || !formData.message) {
            showNotification('Моля попълнете всички задължителни полета', 'error');
            return;
        }

        // Show success message
        showNotification('Благодарим за запитването! Ще се свържа с вас в рамките на 24 часа.', 'success');

        // Reset form
        form.reset();

        // In a real application, you would send the form data to a server here
        console.log('Form submitted:', formData);
    });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 5000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    // Already handled by HTML scroll-behavior: smooth
    // This function is for additional smooth scroll enhancements
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
    // Reinit cursor on window resize if needed
    const cursor = document.querySelector('.cursor');
    if (window.innerWidth < 768) {
        cursor.style.display = 'none';
    } else {
        cursor.style.display = 'block';
    }
});

// ============================================
// BUTTON INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .btn-small, .btn-view');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
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

// ============================================
// ACCESSIBILITY
// ============================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary)';
        } else {
            link.style.color = 'var(--text-secondary)';
        }
    });
});

// ============================================
// FORM INPUT ANIMATIONS
// ============================================

const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--primary)';
        input.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
    });

    input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(6, 182, 212, 0.2)';
        input.style.boxShadow = 'none';
    });
});

// ============================================
// SERVICE CARD HOVER EFFECTS
// ============================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 25px rgba(6, 182, 212, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
});

// ============================================
// PORTFOLIO CARD INTERACTIONS
// ============================================

const portfolioCards = document.querySelectorAll('.portfolio-item');

portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// ============================================
// REVIEW CARD HOVER
// ============================================

const reviewCards = document.querySelectorAll('.review-card');

reviewCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'rgba(6, 182, 212, 0.5)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(6, 182, 212, 0.2)';
    });
});

// ============================================
// TECH BADGE ANIMATIONS
// ============================================

const techBadges = document.querySelectorAll('.tech-badge, .tech');

techBadges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-3px) scale(1.05)';
        badge.style.background = 'var(--primary)';
        badge.style.color = 'var(--background)';
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'translateY(0) scale(1)';
        badge.style.background = 'rgba(6, 182, 212, 0.1)';
        badge.style.color = 'var(--primary)';
    });
});

// ============================================
// ANIMATE ON SCROLL - COUNTER
// ============================================

function animateOnScroll(selector, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// PRELOAD CRITICAL ASSETS
// ============================================

window.addEventListener('load', () => {
    // All critical assets are loaded
    document.body.style.opacity = '1';
});

// ============================================
// DARK MODE SUPPORT
// ============================================

// Check for prefers-color-scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.style.colorScheme = 'dark';
}

// ============================================
// COOKIE NOTICE (Optional)
// ============================================

function initCookieNotice() {
    const cookieNotice = localStorage.getItem('cookieNotice');
    
    if (!cookieNotice) {
        // Show cookie notice only if not previously accepted
        // This can be implemented as needed
    }
}

// Initialize cookie notice
initCookieNotice();

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time: ' + pageLoadTime + 'ms');
    });
}

// ============================================
// HANDLE EXTERNAL LINKS
// ============================================

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Confirm navigation to external site
        if (!confirm('Отваряте външни страница. Продължи?')) {
            e.preventDefault();
        }
    });
});

// ============================================
// PREVENT RIGHT CLICK ON CONTACT METHODS
// ============================================

document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('contextmenu', (e) => {
        // Allow right click, just for demonstration
    });
});

console.log('Продавателникът на Митко - JavaScript loaded successfully! 🚀');
