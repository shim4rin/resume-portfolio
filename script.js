// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeNavigation();
    initializeScrollAnimations();
    initializeSlideshows();
    initializeTypingEffect();
    initializeScrollToTop();
    initializeImageModal();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation
                updateActiveNavigation(this);
            }
        });
    });

    // Update navigation on scroll
    window.addEventListener('scroll', function() {
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
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNavigation(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for skill items
                if (entry.target.classList.contains('skill-category')) {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            item.style.transition = 'all 0.5s ease';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 100);
                    });
                }

                // Add staggered animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-50px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.skill-category, .timeline-item, .achievement-item').forEach(el => {
        observer.observe(el);
    });
}

// Slideshow functionality
function initializeSlideshows() {
    // Initialize slideshow data structure
    window.slideshowData = {};
    
    // Setup slideshows for each project
    document.querySelectorAll('.project-slideshow').forEach(slideshow => {
        const projectId = slideshow.getAttribute('data-project');
        const slides = slideshow.querySelectorAll('.slide');
        
        window.slideshowData[projectId] = {
            slides: slides,
            currentSlide: 0,
            totalSlides: slides.length,
            autoScrollInterval: null,
            isPaused: false
        };

        // Initialize first slide as active
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }

        // Update indicators
        updateSlideIndicators(projectId);

        // Start auto-scrolling if there are multiple slides
        if (slides.length > 1) {
            startAutoScroll(projectId);
        }

        // Pause auto-scroll on hover
        slideshow.addEventListener('mouseenter', () => {
            pauseAutoScroll(projectId);
        });

        slideshow.addEventListener('mouseleave', () => {
            resumeAutoScroll(projectId);
        });
    });
}

// Slideshow control functions
function changeSlide(direction, projectId) {
    const slideshow = window.slideshowData[projectId];
    if (!slideshow || slideshow.totalSlides === 0) {
        return;
    }

    // Remove active class from current slide
    slideshow.slides[slideshow.currentSlide].classList.remove('active');

    // Update current slide index
    slideshow.currentSlide += direction;
    
    if (slideshow.currentSlide >= slideshow.totalSlides) {
        slideshow.currentSlide = 0;
    } else if (slideshow.currentSlide < 0) {
        slideshow.currentSlide = slideshow.totalSlides - 1;
    }

    // Add active class to new slide
    slideshow.slides[slideshow.currentSlide].classList.add('active');

    // Update indicators
    updateSlideIndicators(projectId);

    // Reset auto-scroll timer when manually navigating
    if (slideshow.autoScrollInterval) {
        stopAutoScroll(projectId);
        startAutoScroll(projectId);
    }
}

function currentSlide(slideIndex, projectId) {
    const slideshow = window.slideshowData[projectId];
    if (!slideshow || slideIndex < 1 || slideIndex > slideshow.totalSlides) {
        return;
    }

    // Remove active class from current slide
    slideshow.slides[slideshow.currentSlide].classList.remove('active');

    // Set new current slide
    slideshow.currentSlide = slideIndex - 1;

    // Add active class to new slide
    slideshow.slides[slideshow.currentSlide].classList.add('active');

    // Update indicators
    updateSlideIndicators(projectId);

    // Reset auto-scroll timer when manually navigating
    if (slideshow.autoScrollInterval) {
        stopAutoScroll(projectId);
        startAutoScroll(projectId);
    }
}

function updateSlideIndicators(projectId) {
    const slideshow = window.slideshowData[projectId];
    if (!slideshow) return;

    const indicators = document.querySelectorAll(`[data-project="${projectId}"] .indicator`);
    
    indicators.forEach((indicator, index) => {
        if (index === slideshow.currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Auto-scroll functions
function startAutoScroll(projectId) {
    const slideshow = window.slideshowData[projectId];
    if (!slideshow || slideshow.totalSlides <= 1) return;

    slideshow.autoScrollInterval = setInterval(() => {
        if (!slideshow.isPaused) {
            changeSlide(1, projectId);
        }
    }, 4000); // Change slide every 4 seconds
}

function pauseAutoScroll(projectId) {
    const slideshow = window.slideshowData[projectId];
    if (slideshow) {
        slideshow.isPaused = true;
    }
}

function resumeAutoScroll(projectId) {
    const slideshow = window.slideshowData[projectId];
    if (slideshow) {
        slideshow.isPaused = false;
    }
}

function stopAutoScroll(projectId) {
    const slideshow = window.slideshowData[projectId];
    if (slideshow && slideshow.autoScrollInterval) {
        clearInterval(slideshow.autoScrollInterval);
        slideshow.autoScrollInterval = null;
    }
}

// Typing effect for the main title
function initializeTypingEffect() {
    const title = document.querySelector('.profile-info h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #fff';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #212529;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(33, 37, 41, 0.3);
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;
    
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.background = '#343a40';
        this.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.background = '#212529';
        this.style.transform = 'scale(1)';
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#495057' : '#6c757d'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    // Add keyframe animation
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions for future enhancements
function downloadPortfolioAsPDF() {
    // This would implement PDF generation
    showNotification('PDF download feature coming soon!', 'info');
}

function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'John Kelvin Molina Dela Llana - Portfolio',
            text: 'Check out my professional portfolio',
            url: window.location.href
        });
    } else {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Portfolio URL copied to clipboard!');
        });
    }
}

// Performance optimization
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations and effects
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Additional interactive features
document.addEventListener('keydown', function(e) {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                sharePortfolio();
                break;
            case 'p':
                e.preventDefault();
                downloadPortfolioAsPDF();
                break;
        }
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Contact form enhancement (if needed in future)
function enhanceContactForm() {
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('click', function(e) {
            if (this.href === '#') {
                e.preventDefault();
                showNotification('Contact link not configured yet.');
            }
        });
    });
}

// Initialize contact enhancements
enhanceContactForm();

// Image modal functionality
function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    
    // Global variables for modal
    window.modalData = {
        currentProject: null,
        currentSlideIndex: 0,
        totalSlides: 0
    };

    // Add click events to all project images
    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this);
        });
    });

    // Add click event to profile image
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            openProfileImageModal(this);
        });
    }

    // Close modal when clicking the X
    closeModal.addEventListener('click', closeImageModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeImageModal();
                    break;
                case 'ArrowLeft':
                    changeModalSlide(-1);
                    break;
                case 'ArrowRight':
                    changeModalSlide(1);
                    break;
            }
        }
    });
}

function openImageModal(clickedImage) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalIndicators = document.getElementById('modalIndicators');
    
    // Find which project this image belongs to
    const projectSlideshow = clickedImage.closest('.project-slideshow');
    const projectId = projectSlideshow.getAttribute('data-project');
    const slides = projectSlideshow.querySelectorAll('.slide');
    
    // Find the index of the clicked image
    let clickedIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.contains(clickedImage)) {
            clickedIndex = index;
        }
    });

    // Set modal data
    window.modalData.currentProject = projectId;
    window.modalData.currentSlideIndex = clickedIndex;
    window.modalData.totalSlides = slides.length;

    // Set the modal image
    modalImage.src = clickedImage.src;
    modalImage.alt = clickedImage.alt;

    // Create indicators
    modalIndicators.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'modal-indicator';
        if (i === clickedIndex) {
            indicator.classList.add('active');
        }
        indicator.onclick = () => goToModalSlide(i);
        modalIndicators.appendChild(indicator);
    }

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function openProfileImageModal(profileImage) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalIndicators = document.getElementById('modalIndicators');
    
    // Set modal data for single image
    window.modalData.currentProject = 'profile';
    window.modalData.currentSlideIndex = 0;
    window.modalData.totalSlides = 1;

    // Set the modal image
    modalImage.src = profileImage.src;
    modalImage.alt = profileImage.alt;

    // Hide indicators for single image
    modalIndicators.innerHTML = '';

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function changeModalSlide(direction) {
    const modalData = window.modalData;
    if (!modalData.currentProject) return;

    const newIndex = modalData.currentSlideIndex + direction;
    
    if (newIndex >= modalData.totalSlides) {
        modalData.currentSlideIndex = 0;
    } else if (newIndex < 0) {
        modalData.currentSlideIndex = modalData.totalSlides - 1;
    } else {
        modalData.currentSlideIndex = newIndex;
    }

    updateModalImage();
}

function goToModalSlide(index) {
    window.modalData.currentSlideIndex = index;
    updateModalImage();
}

function updateModalImage() {
    const modalData = window.modalData;
    const modalImage = document.getElementById('modalImage');
    const modalIndicators = document.getElementById('modalIndicators');
    
    // Get the current slide from the project
    const projectSlideshow = document.querySelector(`[data-project="${modalData.currentProject}"]`);
    const slides = projectSlideshow.querySelectorAll('.slide');
    const currentSlide = slides[modalData.currentSlideIndex];
    const currentImage = currentSlide.querySelector('img');

    // Update modal image
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt;

    // Update indicators
    const indicators = modalIndicators.querySelectorAll('.modal-indicator');
    indicators.forEach((indicator, index) => {
        if (index === modalData.currentSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
} 