document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================
       Custom Cursor Logic
       ==================================================== */
    const cursorDot = document.querySelector('.cursor-dot');

    // Only apply custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches && cursorDot) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow loop for cursor using linear interpolation (lerp)
        function animateCursor() {
            // Lerp formulation: current += (target - current) * factor
            // Factor 0.3 for very swift, yet buttery curve
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;

            // GPU accelerated translation avoiding layout thrashing
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, .magnetic-btn');
        clickables.forEach(link => {
            link.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            link.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    /* ====================================================
       Magnetic Button Hover Effect
       ==================================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;

            // Subtle pull towards mouse
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;

            // Internal flow effect tracking if it exists
            const glow = btn.querySelector('.btn-glow');
            if (glow) {
                const glowX = e.clientX - rect.left;
                const glowY = e.clientY - rect.top;
                glow.style.left = `${glowX}px`;
                glow.style.top = `${glowY}px`;
                glow.style.transform = `translate(-50%, -50%) scale(1.5)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            const glow = btn.querySelector('.btn-glow');
            if (glow) {
                glow.style.left = `50%`;
                glow.style.top = `50%`;
                glow.style.transform = `translate(-50%, -50%) scale(0)`;
            }
        });
    });

    /* ====================================================
       Service Cards Premium Tilt Effect
       ==================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation based on cursor position relative to center
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = "none";
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Re-apply staggering transform if it's an even card on desktop
            if (window.innerWidth > 768 && [...card.parentElement.children].indexOf(card) % 2 !== 0) {
                card.style.transform = `translateY(40px) perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
            card.style.transition = "transform 0.5s ease";
        });
    });

    /* ====================================================
       Dynamic Typing Effect (Hero Section)
       ==================================================== */
    const typingElement = document.querySelector('.typing-text');
    const words = [
        "get more reservations.",
        "showcase your menu.",
        "dominate local search.",
        "stand out instantly."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Delete faster
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start typing effect slightly delayed to let intro animations finish
    setTimeout(typeEffect, 1500);

    /* ====================================================
       Intersection Observer (Scroll Animations)
       ==================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .reveal-left, .reveal-right');
    animatedElements.forEach(el => scrollObserver.observe(el));

    /* ====================================================
       Navbar Scroll Effect
       ==================================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    /* ====================================================
       EmailJS Contact Form Handling
       ==================================================== */
    const contactForm = document.getElementById('consultationForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Visual feedback
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.pointerEvents = 'none';

            // Get form values
            const templateParams = {
                organization_name: document.getElementById('name').value,
                user_email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Send via EmailJS (requires configuration)
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS dashboard
            emailjs.send('service_9abafv8', 'template_79a0wlh', templateParams)
                .then(function () {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    submitBtn.style.background = 'var(--accent-gold)';
                    submitBtn.style.color = 'var(--bg-darker)';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                        submitBtn.style.pointerEvents = 'auto';
                    }, 3000);
                }, function (error) {
                    console.error('FAILED...', error);
                    submitBtn.innerHTML = '<span>Failed to Send</span><i class="fas fa-times"></i>';
                    submitBtn.style.background = '#ff4d4d';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.pointerEvents = 'auto';
                    }, 3000);
                });
        });
    }

    /* ====================================================
       Mobile Menu Toggle Logic
       ==================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});
