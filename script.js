// ============================================
// ПРОДАВАТЕЛНИКЪТ НА МИТКО - JAVASCRIPT
// ============================================

// Initialize Stripe
const stripe = Stripe('pk_test_51234567890abcdefghijk'); // Replace with real key
const elements = stripe.elements();
let cardElement;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollProgress();
    initLoadingScreen();
    initNavigation();
    initParticles();
    initStripe();
    initFormSubmission();
    initAdminAccess();
});

// ============================================
// CURSOR & ANIMATIONS
// ============================================

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorShadow = document.querySelector('.cursor-shadow');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = (mouseX - 10) + 'px';
        cursor.style.top = (mouseY - 10) + 'px';

        setTimeout(() => {
            cursorShadow.style.left = (mouseX - 17) + 'px';
            cursorShadow.style.top = (mouseY - 17) + 'px';
        }, 50);

        // Update glow position on service cards
        updateCardGlows(mouseX, mouseY);
    });
}

function updateCardGlows(x, y) {
    document.querySelectorAll('.service-card, .portfolio-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        const distance = Math.sqrt((x - cardX) ** 2 + (y - cardY) ** 2);
        
        if (distance < 300) {
            const glow = card.querySelector('.card-glow');
            const angle = Math.atan2(y - cardY, x - cardX);
            glow.style.setProperty('--x', (Math.cos(angle) * 100 + 50) + '%');
            glow.style.setProperty('--y', (Math.sin(angle) * 100 + 50) + '%');
        }
    });
}

// ============================================
// SCROLL PROGRESS
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

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.9)';
        }
    });
}

// ============================================
// PARTICLES
// ============================================

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 10 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 10 + 20;
        const delay = Math.random() * 5;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);
    }
}

// ============================================
// STRIPE INTEGRATION
// ============================================

function initStripe() {
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#ffffff',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: '#b0c4de'
                }
            },
            invalid: {
                color: '#ff00ff'
            }
        }
    });
}

function openCheckout(serviceType, price) {
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('active');

    const form = document.getElementById('payment-form');
    form.dataset.serviceType = serviceType;
    form.dataset.price = price;

    // Mount card element if not already mounted
    const cardContainer = document.getElementById('card-element');
    if (cardContainer.children.length === 0) {
        cardElement.mount('#card-element');
    }

    form.addEventListener('submit', handlePayment, { once: true });
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
}

async function handlePayment(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const serviceType = e.target.dataset.serviceType;
    const price = parseInt(e.target.dataset.price);

    try {
        // Create payment intent on backend
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: price * 100, // Convert to cents
                currency: 'eur',
                metadata: {
                    serviceType,
                    name,
                    email,
                    phone
                }
            })
        });

        const { clientSecret } = await response.json();

        // Confirm payment
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: { name, email }
            }
        });

        if (error) {
            alert('Плащането е неуспешно: ' + error.message);
        } else if (paymentIntent.status === 'succeeded') {
            // Save order to localStorage
            saveOrder({
                id: generateOrderId(),
                serviceType,
                price,
                name,
                email,
                phone,
                date: new Date().toISOString(),
                status: 'completed',
                paymentId: paymentIntent.id
            });

            alert('Плащането е успешно! Ще ти се свържа скоро.');
            closeCheckout();
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Възникна грешка. Попробуй отново.');
    }
}

// ============================================
// ORDER MANAGEMENT
// ============================================

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

// ============================================
// CONTACT FORM
// ============================================

function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Save message to localStorage
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({
            id: generateOrderId(),
            ...data,
            date: new Date().toISOString(),
            status: 'unread'
        });
        localStorage.setItem('messages', JSON.stringify(messages));

        alert('Съобщението е изпратено! Ще ти отговоря скоро.');
        contactForm.reset();
    });
}

// ============================================
// ADMIN PANEL ACCESS
// ============================================

function initAdminAccess() {
    // Hidden admin access - press Ctrl+Shift+A
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            window.location.href = 'admin.html';
        }
    });
}

// ============================================
// UTILITIES
// ============================================

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        document.querySelector('.cursor').style.display = 'none';
        document.querySelector('.cursor-shadow').style.display = 'none';
    } else {
        document.querySelector('.cursor').style.display = 'block';
        document.querySelector('.cursor-shadow').style.display = 'block';
    }
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('🚀 Продавателникът на Митко - Loaded Successfully!');
