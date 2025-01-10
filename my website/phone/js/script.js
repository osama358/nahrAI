document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const navLinks = document.querySelectorAll('.sidebar .nav-links a');
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');

    // Toggle sidebar function with improved animation
    function toggleSidebar() {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    // Smooth scroll with offset function
    function smoothScroll(target, duration = 1000) {
        const targetPosition = target.offsetTop - header.offsetHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        if (currentScroll > heroSection.offsetHeight / 2) {
            header.classList.add('header-solid');
        } else {
            header.classList.remove('header-solid');
        }
        
        lastScroll = currentScroll;
    });

    // Event Listeners with improved touch handling
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    overlay.addEventListener('click', toggleSidebar);
    overlay.addEventListener('touchstart', toggleSidebar);

    // Enhanced navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    toggleSidebar();
                    setTimeout(() => {
                        smoothScroll(targetElement);
                    }, 300);
                }
            } else {
                window.location.href = targetId;
            }
        });
    });

    // Improved scroll spy functionality
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateActiveSection();
                scrollTimeout = null;
            }, 100);
        }
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Handle touch events for better mobile experience
    let touchStartY;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    sidebar.addEventListener('touchmove', (e) => {
        if (sidebar.classList.contains('active')) {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchY;

            if (Math.abs(touchDiff) > 5) {
                e.preventDefault();
            }
        }
    }, { passive: false });
}); 