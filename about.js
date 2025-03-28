// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check user authentication status
    checkAuthStatus();
    
    // Add scroll animation for sections
    const sections = document.querySelectorAll('section');
    
    // Simple scroll animation
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.8;
        
        sections.forEach(section => {
            // Get section position
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport
            if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
                section.classList.add('visible');
            }
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // User auth status check
    function checkAuthStatus() {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            // User is logged in, update the UI
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            if (loginBtn) loginBtn.classList.add('hidden');
            if (signupBtn) signupBtn.classList.add('hidden');
            
            const userProfile = document.querySelector('.user-profile');
            if (userProfile) {
                userProfile.classList.remove('hidden');
                const userName = userProfile.querySelector('span');
                if (userName) {
                    userName.textContent = currentUser;
                }
            }
        }
    }
});

// Add CSS animation class to style
if (!document.querySelector('#animate-style')) {
    const style = document.createElement('style');
    style.id = 'animate-style';
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-section {
            opacity: 1;
            transform: none;
        }
        
        .feature-card, .team-member {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
        }
        
        section.visible .feature-card, section.visible .team-member {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(2), .team-member:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(3), .team-member:nth-child(3) {
            transition-delay: 0.4s;
        }
        
        .feature-card:nth-child(4), .team-member:nth-child(4) {
            transition-delay: 0.6s;
        }
        
        .feature-card:nth-child(5) {
            transition-delay: 0.8s;
        }
        
        .feature-card:nth-child(6) {
            transition-delay: 1s;
        }
    `;
    document.head.appendChild(style);
}

// Trigger scroll event to initialize visibility
window.dispatchEvent(new Event('scroll'));