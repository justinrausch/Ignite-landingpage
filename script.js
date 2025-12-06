// Smooth scroll function with ease-in-out
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 2000; // 2 seconds for slower scroll
    let start = null;

    // Ease-in-out function
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Menu Dropdown Toggle
(function() {
    let menuButton, dropdownMenu;
    
    function initMenuDropdown() {
        menuButton = document.getElementById('menu-button');
        dropdownMenu = document.getElementById('dropdown-menu');
        
        if (!menuButton || !dropdownMenu) {
            console.error('Menu elements not found', { menuButton, dropdownMenu });
            return;
        }
        
        // Toggle dropdown on button click/tap
        function toggleMenu(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            dropdownMenu.classList.toggle('active');
        }
        
        menuButton.addEventListener('click', toggleMenu);
        menuButton.addEventListener('touchend', toggleMenu);
        
        // Close dropdown when clicking outside (with delay to avoid immediate close)
        document.addEventListener('click', function(e) {
            if (dropdownMenu && dropdownMenu.classList.contains('active')) {
                if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            }
        });
        
        // Handle smooth scroll for dropdown links
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        dropdownLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        smoothScrollTo(targetElement);
                        dropdownMenu.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenuDropdown);
    } else {
        initMenuDropdown();
    }
})();

// Regular anchor link behavior (no smooth scroll)
// Links will use default browser scroll behavior

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

// Set initial gray background
if (navbar) {
    navbar.style.background = 'rgba(25, 25, 25, 0.6)';
}

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(25, 25, 25, 0.7)';
    } else {
        navbar.style.background = 'rgba(25, 25, 25, 0.6)';
    }
    
    lastScroll = currentScroll;
});

// Animate progress bar on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress-bar');
            if (progressBar) {
                const progress = 65; // 65% complete
                const circumference = 2 * Math.PI * 45; // radius is 45
                const offset = circumference - (progress / 100) * circumference;
                progressBar.style.strokeDashoffset = offset;
            }
        }
    });
}, observerOptions);

// Observe phone mockup when it comes into view
const phoneMockup = document.querySelector('.phone-mockup');
if (phoneMockup) {
    observer.observe(phoneMockup);
}

// Animate feature cards on scroll
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Animate steps on scroll
const steps = document.querySelectorAll('.step');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, {
    threshold: 0.2
});

steps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateX(-30px)';
    step.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    stepObserver.observe(step);
});

// Hero typing and count animation
document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.getElementById('typing-text');
    const countNumber = document.getElementById('count-number');
    const daysText = document.getElementById('days-text');
    
    if (typingText && countNumber && daysText) {
        const textToType = 'Change your life in'; // No trailing space - HTML handles spacing
        let charIndex = 0;
        
        // Type out "Change your life in "
        function typeText() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType[charIndex];
                charIndex++;
                setTimeout(typeText, 70); // 70ms delay between characters
            } else {
                // After typing is complete, start counting
                setTimeout(() => {
                    countUp();
                }, 300);
            }
        }
        
        // Count from 0 to 70
        function countUp() {
            // Show the count number and set it to 0
            countNumber.style.opacity = '1';
            countNumber.textContent = '0';
            
            let current = 0;
            const target = 70;
            const duration = 800; // 0.8 seconds for counting
            const increment = target / (duration / 16); // 60fps
            
            function updateCount() {
                current += increment;
                if (current < target) {
                    countNumber.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    countNumber.textContent = target;
                    // After counting, type " days."
                    setTimeout(() => {
                        typeDays();
                    }, 300);
                }
            }
            
            // Small delay before starting the count
            setTimeout(() => {
                updateCount();
            }, 100);
        }
        
        // Type out " days." (no auto-scroll)
        function typeDays() {
            const daysToType = 'days.'; // No leading space - HTML handles spacing
            let charIndex = 0;
            
            function typeDaysText() {
                if (charIndex < daysToType.length) {
                    daysText.textContent += daysToType[charIndex];
                    charIndex++;
                    setTimeout(typeDaysText, 70);
                } else {
                    // After typing is complete, animate text up and image sliding up
                    setTimeout(() => {
                        const heroTitle = document.querySelector('.hero-title');
                        const heroImage = document.getElementById('hero-image');
                        const heroTagline = document.getElementById('hero-tagline');
                        const downloadButton = document.getElementById('download-ignite-button');
                        
                        if (heroTitle) {
                            heroTitle.classList.add('move-up');
                        }
                        
                        // Show tagline slightly before the images
                        if (heroTagline) {
                            heroTagline.classList.add('slide-up');
                        }
                        
                        // Show main image first
                        setTimeout(() => {
                            if (heroImage) {
                                heroImage.classList.add('slide-up');
                            }
                        }, 300); // 300ms delay after tagline
                        
                        // Show Download button at the same time as hero image
                        setTimeout(() => {
                            if (downloadButton) {
                                downloadButton.classList.add('slide-up');
                            }
                        }, 300); // 300ms delay after tagline (same time as hero image)
                    }, 300); // Wait 0.3 seconds after typing completes
                }
            }
            
            typeDaysText();
        }
        
        // Start the animation
        setTimeout(() => {
            typeText();
        }, 500);
    }
    
    // Add gradient definition to SVG
    const progressSvg = document.querySelector('.progress-svg');
    if (progressSvg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ff6b35');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#ff8c42');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        progressSvg.insertBefore(defs, progressSvg.firstChild);
    }
});

// Parallax effect for hero background orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Problem image scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const problemImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    const problemImage = document.getElementById('problem-image');
    if (problemImage) {
        problemImageObserver.observe(problemImage);
    }
});

