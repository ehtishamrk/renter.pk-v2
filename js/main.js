<script>
        

        // ============================================
        // SCROLL PROGRESS BAR
        // ============================================
        const scrollProgress = document.querySelector('.scroll-progress');
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // ============================================
        // REAL PRELOADER LOGIC
        // ============================================
        const preloader = document.querySelector('.preloader');
        const preloaderCounter = document.querySelector('.preloader-counter');
        let count = 0;
        let isLoaded = false;

        // 1. Mark as loaded when the window is actually ready
        window.addEventListener('load', () => {
            isLoaded = true;
        });

        // 2. Run the counter, but pause at 99% until isLoaded is true
        const counterInterval = setInterval(() => {
            if (count < 99) {
                count++;
                preloaderCounter.textContent = count;
            } else if (count === 99 && isLoaded) {
                // Only finish if window is loaded
                count++;
                preloaderCounter.textContent = count;
                clearInterval(counterInterval);
                
                // Trigger exit animation
                setTimeout(() => {
                    preloader.classList.add('complete');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 1200);
                }, 200);
            }
        }, 30); // Speed of counter

        // ============================================
        // COOKIE CONSENT
        // ============================================
        function showCookieConsent() {
            if (!localStorage.getItem('cookieConsent')) {
                setTimeout(() => {
                    document.getElementById('cookieConsent').classList.add('show');
                }, 3000);
            }
        }
        showCookieConsent();

        function acceptCookies() {
            localStorage.setItem('cookieConsent', 'accepted');
            document.getElementById('cookieConsent').classList.remove('show');
        }

        function declineCookies() {
            localStorage.setItem('cookieConsent', 'declined');
            document.getElementById('cookieConsent').classList.remove('show');
        }

        // ============================================
        // NAVIGATION
        // ============================================
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile Menu
        const mobileMenu = document.getElementById('mobileMenu');
        function toggleMobileMenu() {
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        }

        // ============================================
        // PAGE NAVIGATION
        // ============================================
       function showPage(pageId) {
            // 1. Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // 2. Show target page
            const targetPage = document.getElementById('page-' + pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // 3. Close mobile menu if open
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }

            // --- NEW LOGIC: Update Navigation Active State ---
            // Remove active class from all links
            document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(link => {
                link.classList.remove('active');
            });

            // Find links that point to this page and add active class
            // We look for onclick="showPage('pageId')"
            const activeLinks = document.querySelectorAll(`[onclick="showPage('${pageId}')"]`);
            activeLinks.forEach(link => {
                if(link.tagName === 'A') link.classList.add('active');
            });
            // ------------------------------------------------

            // 4. Re-trigger animations
            initRevealAnimations();
        }
        // ============================================
        // MODALS
        // ============================================
        function openModal(modalType) {
            document.getElementById(modalType + 'Modal').classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalType) {
            document.getElementById(modalType + 'Modal').classList.remove('show');
            document.body.style.overflow = '';
        }

        function switchModal(from, to) {
            closeModal(from);
            setTimeout(() => openModal(to), 300);
        }

        // Close modal on outside click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.show').forEach(modal => {
                    modal.classList.remove('show');
                });
                document.body.style.overflow = '';
            }
        });

        // ============================================
        // FORM HANDLERS
        // ============================================
      function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-btn');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;
    
    // Show loading state
    btn.disabled = true;
    btnText.textContent = 'Logging in...';
    btn.style.opacity = '0.7';
    
    // Simulate API call (replace with real API)
    setTimeout(() => {
        // Success
        btnText.textContent = 'Success!';
        btn.style.background = '#22c55e';
        
        setTimeout(() => {
            closeModal('login');
            // Reset button
            btn.disabled = false;
            btnText.textContent = originalText;
            btn.style.opacity = '1';
            btn.style.background = '';
        }, 1000);
    }, 1500);
}

        function handleSignup(e) {
            e.preventDefault();
    const btn = e.target.querySelector('.form-btn');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;
    
    // Show loading state
    btn.disabled = true;
    btnText.textContent = 'Signing Up...';
    btn.style.opacity = '0.7';
    
    // Simulate API call (replace with real API)
    setTimeout(() => {
        // Success
        btnText.textContent = 'Success!';
        btn.style.background = '#22c55e';
        
        setTimeout(() => {
            closeModal('signup');
            // Reset button
            btn.disabled = false;
            btnText.textContent = originalText;
            btn.style.opacity = '1';
            btn.style.background = '';
        }, 1000);
    }, 1500);
}

        function handleContact(e) {
            e.preventDefault();
            alert('Message sent successfully! We\'ll get back to you soon.');
            e.target.reset();
        }

        // Improved Filter Logic with Timer Clearing
        function filterListings(category, btn) {
            // Update active button state
            document.querySelectorAll('.featured-tab').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('#featuredListings .listing-card');
            cards.forEach(card => {
                // Clear any pending timeout attached to this card
                if (card.dataset.timeoutId) {
                    clearTimeout(Number(card.dataset.timeoutId));
                }

                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Small delay to allow display:block to apply before opacity transition
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    
                    // Store the timeout ID so we can cancel it if clicked again
                    const timeoutId = setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Match CSS transition time
                    card.dataset.timeoutId = timeoutId;
                }
            });
        }

       function filterVehicles(type, btn) {
            // Update active state
            document.querySelectorAll('#page-vehicles .toggle-tab').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('#vehiclesGrid .listing-card');
            cards.forEach(card => {
                // Clear any pending hide timer
                if (card.dataset.timeoutId) {
                    clearTimeout(Number(card.dataset.timeoutId));
                }

                if (type === 'all' || card.dataset.type === type) {
                    card.style.display = 'block';
                    // Use requestAnimationFrame for smooth display -> opacity transition
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    
                    // Set new timer and save ID
                    const timeoutId = setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                    card.dataset.timeoutId = timeoutId;
                }
            });
        }

       function filterTools(type, btn) {
            // Update active state
            document.querySelectorAll('#page-tools .toggle-tab').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('#toolsGrid .listing-card');
            cards.forEach(card => {
                // Clear any pending hide timer
                if (card.dataset.timeoutId) {
                    clearTimeout(Number(card.dataset.timeoutId));
                }

                if (type === 'all' || card.dataset.type === type) {
                    card.style.display = 'block';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    
                    const timeoutId = setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                    card.dataset.timeoutId = timeoutId;
                }
            });
        }

        function filterClothes(type, btn) {
            // Update active state
            document.querySelectorAll('#page-clothes .toggle-tab').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('#clothesGrid .listing-card');
            cards.forEach(card => {
                // Clear any pending hide timer
                if (card.dataset.timeoutId) {
                    clearTimeout(Number(card.dataset.timeoutId));
                }

                if (type === 'all' || card.dataset.type === type) {
                    card.style.display = 'block';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    
                    const timeoutId = setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                    card.dataset.timeoutId = timeoutId;
                }
            });
        }

        // ============================================
        // CATEGORY SCROLL
        // ============================================
        function scrollCategories(direction) {
            const track = document.getElementById('categoriesTrack');
            const scrollAmount = 380;
            track.scrollBy({
                left: scrollAmount * direction,
                behavior: 'smooth'
            });
        }

        // ============================================
        // FAQ ACCORDION
        // ============================================
        function toggleFaq(btn) {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('open');
            });

            // Open clicked one if it wasn't already open
            if (!wasOpen) {
                item.classList.add('open');
            }
        }

        // ============================================
        // REVEAL ANIMATIONS
        // ============================================
        function initRevealAnimations() {
            const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            reveals.forEach(el => observer.observe(el));
        }
        initRevealAnimations();

        // ============================================
        // FAVORITE TOGGLE
        // ============================================
        document.querySelectorAll('.listing-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                if (btn.classList.contains('active')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            });
        });

        // ============================================
        // STEPS LINE ANIMATION
        // ============================================
        const stepsLine = document.querySelector('.hiw-line');
        if (stepsLine) {
            const stepsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stepsLine.classList.add('animated');
                    }
                });
            }, { threshold: 0.5 });
            stepsObserver.observe(stepsLine);
        }

        // ============================================
        // COUNTER ANIMATION
        // ============================================
        function animateCounter(element, target, suffix = '') {
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const animate = () => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString() + suffix;
                } else {
                    element.textContent = Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }

        // Animate hero stats
        const heroStats = document.querySelectorAll('.hero-float-stat h4');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const h4 = entry.target;
                    const text = h4.textContent;
                    if (text.includes('K')) {
                        const num = parseInt(text);
                        animateCounter(h4, num, 'K+');
                    }
                    statsObserver.unobserve(h4);
                }
            });
        }, { threshold: 0.5 });

        heroStats.forEach(stat => statsObserver.observe(stat));

        // ============================================
        // MAGNETIC BUTTON EFFECT
        // ============================================
        document.querySelectorAll('.btn-magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // ============================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ============================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // ============================================
        // PARALLAX EFFECT FOR HERO BLOBS
        // ============================================
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const blobs = document.querySelectorAll('.hero-blob');
                blobs.forEach((blob, index) => {
                    const speed = 0.2 + (index * 0.1);
                    blob.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        }

        // ============================================
        // TILT EFFECT FOR CARDS
        // ============================================
        if (window.innerWidth > 768) {
            document.querySelectorAll('.hero-card-main').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translate(-50%, -50%)';
                });
            });
        }

        // ============================================
        // IMAGE PLACEHOLDER LOADING
        // ============================================
        document.querySelectorAll('.listing-image-bg, .blog-image, .hero-card-image').forEach(img => {
            img.classList.add('loaded');
        });

        // ============================================
        // INITIALIZE ALL
        // ============================================
        window.addEventListener('load', () => {
            console.log('Renter.pk loaded successfully!');
        });
        // ============================================
        // PREVENT DEFAULT ON DEMO LINKS
        // ============================================
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.hasAttribute('onclick')) {
                    e.preventDefault();
                }
            });
        });

        // Console welcome message
        console.log('%c Welcome to Renter.pk ', 'background: #722F37; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
        console.log('%c Pakistan\'s Premier Rental Marketplace ', 'color: #722F37; font-size: 14px;');
   // Loading Spinner Functions
function showLoading(text = 'Loading...') {
    const spinner = document.getElementById('loadingSpinner');
    spinner.querySelector('.spinner-text').textContent = text;
    spinner.classList.add('show');
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('show');
}
        // Improved keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
        
        // Close mobile menu
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            toggleMobileMenu();
        }
    }
    
    // Tab trap in modals
    if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal-overlay.show .modal');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});
    </script>
