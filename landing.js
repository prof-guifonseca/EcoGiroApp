// EcoGiro Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initHeaderEffects();
    initCTAButtons();
    initScrollAnimations();
    initContactForms();
    initMobileMenuToggle();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Header effects on scroll
function initHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active section in navigation
        updateActiveSection();
    });
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const activeNavLink = document.querySelector(`[href="#${section.id}"]`);
            if (activeNavLink) {
                updateActiveNavLink(activeNavLink);
            }
        }
    });
}

// CTA Button functionality
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            // Add loading state
            this.classList.add('loading');
            
            // Handle different button types
            switch(buttonText) {
                case 'Saiba Mais':
                    handleSaibaMais();
                    break;
                case 'Entre em Contato':
                    handleEntreEmContato();
                    break;
                case 'Solicite uma Proposta':
                    handleSoliciteProposta();
                    break;
                case 'Agende uma Demonstração':
                    handleAgendeDemonstracao();
                    break;
                case 'Download da Proposta':
                    handleDownloadProposta();
                    break;
                default:
                    console.log('Botão clicado:', buttonText);
            }
            
            // Remove loading state after 2 seconds
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        });
    });
}

// Handle "Saiba Mais" button
function handleSaibaMais() {
    const conceptSection = document.querySelector('#conceito');
    if (conceptSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = conceptSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle "Entre em Contato" button
function handleEntreEmContato() {
    // Create modal or redirect to contact form
    showContactModal();
}

// Handle "Solicite uma Proposta" button
function handleSoliciteProposta() {
    showProposalModal();
}

// Handle "Agende uma Demonstração" button
function handleAgendeDemonstracao() {
    showDemoModal();
}

// Handle "Download da Proposta" button
function handleDownloadProposta() {
    // Simulate download
    showNotification('Download iniciado! Verifique sua pasta de downloads.', 'success');
}

// Show contact modal
function showContactModal() {
    const modal = createModal('Entre em Contato', `
        <form id="contactForm" class="contact-form">
            <div class="form-group">
                <label for="nome" class="form-label">Nome *</label>
                <input type="text" id="nome" name="nome" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email" class="form-label">E-mail *</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="tel" id="telefone" name="telefone" class="form-control">
            </div>
            <div class="form-group">
                <label for="organizacao" class="form-label">Organização</label>
                <input type="text" id="organizacao" name="organizacao" class="form-control">
            </div>
            <div class="form-group">
                <label for="mensagem" class="form-label">Mensagem *</label>
                <textarea id="mensagem" name="mensagem" class="form-control" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--full-width">Enviar Mensagem</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleContactSubmit);
}

// Show proposal modal
function showProposalModal() {
    const modal = createModal('Solicite uma Proposta', `
        <form id="proposalForm" class="proposal-form">
            <div class="form-group">
                <label for="nomeEmpresa" class="form-label">Nome da Empresa *</label>
                <input type="text" id="nomeEmpresa" name="nomeEmpresa" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="tipoOrganizacao" class="form-label">Tipo de Organização *</label>
                <select id="tipoOrganizacao" name="tipoOrganizacao" class="form-control" required>
                    <option value="">Selecione...</option>
                    <option value="prefeitura">Prefeitura</option>
                    <option value="industria">Indústria</option>
                    <option value="investidor">Investidor de Impacto</option>
                    <option value="ong">Organização Social</option>
                    <option value="outro">Outro</option>
                </select>
            </div>
            <div class="form-group">
                <label for="interesseEm" class="form-label">Interesse em *</label>
                <select id="interesseEm" name="interesseEm" class="form-control" required>
                    <option value="">Selecione...</option>
                    <option value="residencial">EcoGiro Casa</option>
                    <option value="industrial">EcoGiro Fábrica</option>
                    <option value="ambos">Ambas as soluções</option>
                    <option value="consultoria">Consultoria Ambiental</option>
                </select>
            </div>
            <div class="form-group">
                <label for="contatoProposta" class="form-label">E-mail para Contato *</label>
                <input type="email" id="contatoProposta" name="contatoProposta" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary btn--full-width">Solicitar Proposta</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('proposalForm');
    form.addEventListener('submit', handleProposalSubmit);
}

// Show demo modal
function showDemoModal() {
    const modal = createModal('Agende uma Demonstração', `
        <form id="demoForm" class="demo-form">
            <div class="form-group">
                <label for="nomeResponsavel" class="form-label">Nome do Responsável *</label>
                <input type="text" id="nomeResponsavel" name="nomeResponsavel" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="emailDemo" class="form-label">E-mail *</label>
                <input type="email" id="emailDemo" name="emailDemo" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="dataPreferida" class="form-label">Data Preferida</label>
                <input type="date" id="dataPreferida" name="dataPreferida" class="form-control">
            </div>
            <div class="form-group">
                <label for="horarioPreferido" class="form-label">Horário Preferido</label>
                <select id="horarioPreferido" name="horarioPreferido" class="form-control">
                    <option value="">Selecione...</option>
                    <option value="manha">Manhã (9h-12h)</option>
                    <option value="tarde">Tarde (13h-17h)</option>
                    <option value="noite">Noite (18h-20h)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="observacoes" class="form-label">Observações</label>
                <textarea id="observacoes" name="observacoes" class="form-control" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--full-width">Agendar Demonstração</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('demoForm');
    form.addEventListener('submit', handleDemoSubmit);
}

// Create modal element
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Handle modal close
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            closeModal(modal);
        }
    });
    
    return modal;
}

// Close modal
function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    
    // Close modal after 2 seconds
    setTimeout(() => {
        closeModal(e.target.closest('.modal-overlay'));
    }, 2000);
}

// Handle proposal form submission
function handleProposalSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    showNotification('Proposta solicitada com sucesso! Enviaremos por e-mail em até 24 horas.', 'success');
    
    // Close modal after 2 seconds
    setTimeout(() => {
        closeModal(e.target.closest('.modal-overlay'));
    }, 2000);
}

// Handle demo form submission
function handleDemoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    showNotification('Demonstração agendada com sucesso! Confirmaremos por e-mail.', 'success');
    
    // Close modal after 2 seconds
    setTimeout(() => {
        closeModal(e.target.closest('.modal-overlay'));
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-${type === 'success' ? 'success' : 'primary'});
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .feature-card, .platform-card, .business-card, .impact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize contact forms
function initContactForms() {
    // Add form validation and enhancement
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('focus', function() {
                this.classList.remove('error');
            });
        });
    });
}

// Validate form field
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    field.classList.remove('error');
    return true;
}

// Initialize mobile menu toggle
function initMobileMenuToggle() {
    // Add mobile menu functionality if needed
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--eco-primary);
        cursor: pointer;
    `;
    
    // Add mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            
            .nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--color-surface);
                border-top: 1px solid var(--color-border);
                padding: 20px;
                flex-direction: column;
                gap: 16px;
            }
            
            .nav.active {
                display: flex;
            }
            
            .header-content {
                position: relative;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
        }
        
        .modal-content {
            background: var(--color-surface);
            border-radius: 12px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--color-border);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--eco-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-text-secondary);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .form-control.error {
            border-color: var(--color-error);
        }
    `;
    
    document.head.appendChild(style);
    
    // Insert mobile toggle
    header.querySelector('.header-content').insertBefore(mobileToggle, nav);
    
    // Handle mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    
    // Close mobile menu when clicking nav links
    nav.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            nav.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
}

// Add CSS for modal animations
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(modalStyles);