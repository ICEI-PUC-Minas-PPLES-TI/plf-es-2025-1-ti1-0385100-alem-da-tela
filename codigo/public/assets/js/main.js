document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Skip if href is just '#'
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                navLinks.classList.remove('active'); // Close mobile menu after clicking
            }
        });
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Show content sections
function showContent(contentType) {
    // Hide all content areas
    document.querySelectorAll('.content-area').forEach(area => {
        area.classList.add('hidden');
    });

    // Show the selected content area
    const contentSection = document.getElementById('conteudo');
    const selectedContent = document.getElementById(`${contentType}-content`);
    
    if (contentSection && selectedContent) {
        contentSection.classList.remove('hidden');
        selectedContent.classList.remove('hidden');
        
        // Smooth scroll to content
        contentSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Close modal if open
    closeModal('ajuda-modal');
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevenção de scroll 
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Handle form submissions (for future implementation)
function handleEmergencyContact(event) {
    event.preventDefault();
    // Add contact form handling logic here
}