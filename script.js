// XYNOX STUDIOS - Main JavaScript

// ========================================
// PRELOADER
// ========================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 3000);
});

// ========================================
// NAVIGATION
// ========================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Update active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ========================================
// SCROLL PROGRESS BAR
// ========================================

const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll('.glass-card, .experience-card, .team-card, .section-title');

const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(element => {
    revealOnScroll.observe(element);
});

// ========================================
// FEATURED RELEASE CAROUSEL
// ========================================

const releases = [
    {
        title: 'InsaneSMP',
        description: 'Step into the Nether portal and experience chaos like never before.',
        image: 'https://via.placeholder.com/800x450/6a00ff/ff007f?text=InsaneSMP',
        link: 'https://insanesmp.xynoxstudios.com'
    },
    {
        title: 'Nexus Arena',
        description: 'Compete in epic real-time PvP battles across anti-gravity zones.',
        image: 'https://via.placeholder.com/800x450/00d4ff/6a00ff?text=Nexus+Arena',
        link: '#'
    },
    {
        title: 'Cosmic Forge',
        description: 'Create unlimited worlds and share them with our global community.',
        image: 'https://via.placeholder.com/800x450/ff007f/00d4ff?text=Cosmic+Forge',
        link: '#'
    }
];

let currentReleaseIndex = 0;

const releaseCard = document.getElementById('releaseCard');
const releaseTitle = document.getElementById('releaseTitle');
const releaseDescription = document.getElementById('releaseDescription');
const releaseImage = document.getElementById('releaseImage');
const releaseLink = document.getElementById('releaseLink');
const carouselIndicators = document.getElementById('carouselIndicators');

function updateReleaseCarousel() {
    const release = releases[currentReleaseIndex];
    
    releaseImage.style.opacity = '0';
    setTimeout(() => {
        releaseImage.src = release.image;
        releaseImage.style.opacity = '1';
    }, 200);
    
    releaseTitle.textContent = release.title;
    releaseDescription.textContent = release.description;
    releaseLink.onclick = () => {
        if (release.link !== '#') {
            triggerPortalTransition(release.link);
        }
    };
    
    updateIndicators();
}

function updateIndicators() {
    carouselIndicators.innerHTML = '';
    releases.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        if (index === currentReleaseIndex) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => {
            currentReleaseIndex = index;
            updateReleaseCarousel();
        });
        carouselIndicators.appendChild(indicator);
    });
}

function rotateReleases() {
    currentReleaseIndex = (currentReleaseIndex + 1) % releases.length;
    updateReleaseCarousel();
}

// Initialize carousel
if (releaseCard) {
    updateReleaseCarousel();
    setInterval(rotateReleases, 20000); // Rotate every 20 seconds
    
    // Pause on hover
    releaseCard.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
}

// ========================================
// PORTAL TRANSITION
// ========================================

function triggerPortalTransition(targetUrl) {
    const portalContainer = document.getElementById('portalContainer');
    if (!portalContainer) return;
    
    portalContainer.classList.add('active');
    
    // Initialize Three.js portal
    initPortal();
    
    // Redirect after animation
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 2500);
}

// ========================================
// MOUSE PARALLAX EFFECT
// ========================================

document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.release-image-container');
    
    parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const moveX = (x - 0.5) * 10;
        const moveY = (y - 0.5) * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
    });
});

// ========================================
// FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Create answer div if it doesn't exist
    if (!answer) {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'faq-answer';
        item.appendChild(answerDiv);
    }
    
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// ========================================
// CONTACT FORM SUBMISSION
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Show success message
        const button = contactForm.querySelector('.cta-button');
        const originalText = button.textContent;
        button.textContent = 'MESSAGE SENT ✓';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            contactForm.reset();
        }, 2000);
        
        // Log form data (In production, send to server)
        console.log('Form submitted:', { name, email, subject, message });
    });
}

// ========================================
// LAZY LOAD IMAGES
// ========================================

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

// ========================================
// GLOW CURSOR EFFECT
// ========================================

const glowCursor = document.createElement('div');
glowCursor.className = 'glow-cursor';
glowCursor.style.cssText = `
    position: fixed;
    width: 30px;
    height: 30px;
    border: 2px solid rgba(255, 0, 127, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    box-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
    display: none;
`;
document.body.appendChild(glowCursor);

document.addEventListener('mousemove', (e) => {
    glowCursor.style.left = (e.clientX - 15) + 'px';
    glowCursor.style.top = (e.clientY - 15) + 'px';
    glowCursor.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    glowCursor.style.display = 'none';
});

// ========================================
// SMOOTH PAGE TRANSITIONS
// ========================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') !== '#') {
            e.preventDefault();
            const href = link.getAttribute('href');
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// ========================================
// DYNAMIC GRADIENT ANIMATION
// ========================================

const gradient = document.createElement('style');
gradient.textContent = `
    @keyframes gradient-animation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(gradient);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Reduce particles on mobile
if (window.innerWidth < 768) {
    document.documentElement.style.setProperty('--particle-count', '30');
}

// Disable parallax on mobile
if (window.innerWidth < 768) {
    document.removeEventListener('mousemove', (e) => {
        // Parallax removed for mobile
    });
}

// ========================================
// PAGE VISIBILITY
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
    } else {
        // Resume animations
    }
});

console.log('🎮 XYNOX Studios Website Loaded');
