// ===================================
// RAYO DE SOL - JAVASCRIPT
// Replica of Los Laureles Functionality
// ===================================

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    }
    
    lastScroll = currentScroll;
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .location-card, .concept-card, .attraction-card, .sector-detail');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// FORM VALIDATION & HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');
const telefonoInput = document.getElementById('telefono');

// --- Formateo automático teléfono chileno ---
telefonoInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d+]/g, '');
    
    // Si no empieza con +56, agregar
    if (value.length > 0 && !value.startsWith('+')) {
        // Si escribió 56... o 9...
        if (value.startsWith('56')) {
            value = '+' + value;
        } else if (value.startsWith('9') && value.length <= 9) {
            value = '+56' + value;
        } else if (!value.startsWith('0')) {
            value = '+56' + value;
        }
    }
    
    // Formatear como +56 9 XXXX XXXX
    let formatted = '';
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) {
        formatted = '';
    } else if (digits.length <= 2) {
        formatted = '+' + digits;
    } else if (digits.length <= 3) {
        formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2);
    } else if (digits.length <= 7) {
        formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 3) + ' ' + digits.slice(3);
    } else {
        formatted = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 3) + ' ' + digits.slice(3, 7) + ' ' + digits.slice(7, 11);
    }
    
    e.target.value = formatted;
    validateField(e.target);
});

// --- Validaciones individuales ---
function showError(fieldId, message) {
    const errorSpan = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('visible');
    }
    if (input) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
}

function clearError(fieldId) {
    const errorSpan = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
    }
    if (input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

function validateField(field) {
    const id = field.id;
    const value = field.value.trim();
    
    switch(id) {
        case 'nombre':
            if (value.length === 0) {
                showError(id, 'El nombre es obligatorio');
                return false;
            }
            if (value.length < 3) {
                showError(id, 'Ingresa al menos 3 caracteres');
                return false;
            }
            if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑüÜ\s]+$/.test(value)) {
                showError(id, 'Solo se permiten letras y espacios');
                return false;
            }
            clearError(id);
            return true;
            
        case 'email':
            if (value.length === 0) {
                showError(id, 'El email es obligatorio');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(id, 'Ingresa un email válido (ej: correo@ejemplo.cl)');
                return false;
            }
            clearError(id);
            return true;
            
        case 'telefono':
            const digits = value.replace(/\D/g, '');
            if (value.length === 0) {
                showError(id, 'El teléfono es obligatorio');
                return false;
            }
            if (!/^\+56\s?9\s?\d{4}\s?\d{4}$/.test(value)) {
                showError(id, 'Ingresa un celular chileno válido (+56 9 XXXX XXXX)');
                return false;
            }
            clearError(id);
            return true;
            
        case 'mensaje':
            if (value.length === 0) {
                showError(id, 'El mensaje es obligatorio');
                return false;
            }
            if (value.length < 10) {
                showError(id, 'Escribe al menos 10 caracteres');
                return false;
            }
            clearError(id);
            return true;
    }
    return true;
}

// --- Validación en tiempo real al salir del campo ---
['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
        field.addEventListener('blur', () => validateField(field));
        // Limpiar error mientras escribe (si ya era válido)
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) {
                validateField(field);
            }
        });
    }
});

// --- Envío del formulario ---
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const fields = ['nombre', 'email', 'telefono', 'mensaje'];
    let isValid = true;
    
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Hacer scroll al primer error
        const firstError = contactForm.querySelector('.invalid');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    
    fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
            // Limpiar estados visuales
            fields.forEach(id => {
                const input = document.getElementById(id);
                input.classList.remove('valid', 'invalid');
            });
        } else {
            throw new Error('Error en el envío');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Image Lazy Loading Fallback
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Contact Info Hover Animation - Stagger Effect
const contactInfo = document.querySelector('.contact-info');
if (contactInfo) {
    contactInfo.addEventListener('mouseenter', () => {
        const elements = contactInfo.querySelectorAll('h2, .contact-details, .developer-info');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'none';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
}