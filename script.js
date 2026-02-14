/* ============================================
   ÉCLAT MODERNE — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Page Loader ----
    const loader = document.getElementById('pageLoader');
    const progress = document.getElementById('loaderProgress');

    if (loader && progress) {
        let loaded = 0;
        const loadInterval = setInterval(() => {
            loaded += Math.random() * 25 + 5;
            if (loaded >= 100) {
                loaded = 100;
                clearInterval(loadInterval);
                progress.style.width = '100%';
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.classList.add('loaded');
                }, 400);
            }
            progress.style.width = loaded + '%';
        }, 200);
    }

    // ---- Floating Gold Particles ----
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = -(Math.random() * 0.3 + 0.05);
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
                this.growing = Math.random() > 0.5;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.5) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.05) this.reset();
                }

                if (this.y < -10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(236, 192, 62, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animFrame = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ---- Custom Cursor ----
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 3 + 'px';
            cursorDot.style.top = mouseY - 3 + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX - 18 + 'px';
            cursorRing.style.top = ringY - 18 + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = document.querySelectorAll('a, button, input, .product-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    }

    // ---- Hero Parallax ----
    const heroVisual = document.getElementById('heroVisual');
    if (heroVisual && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            heroVisual.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
        }, { passive: true });
    }

    // ---- Navigation Scroll ----
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Carousel ----
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (carouselTrack) {
        const cards = carouselTrack.querySelectorAll('.product-card');
        let currentIndex = 0;
        let visibleCards = getVisibleCards();

        function getVisibleCards() {
            const width = window.innerWidth;
            if (width >= 1100) return 3;
            if (width >= 768) return 2;
            return 1;
        }

        function getCardWidth() {
            const card = cards[0];
            if (!card) return 0;
            const style = window.getComputedStyle(carouselTrack);
            const gap = parseInt(style.gap) || 28;
            return card.offsetWidth + gap;
        }

        function updateCarousel() {
            const offset = -currentIndex * getCardWidth();
            carouselTrack.style.transform = `translateX(${offset}px)`;
            updateDots();
        }

        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const slides = Math.max(1, cards.length - visibleCards + 1);
            for (let i = 0; i < slides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const slides = Math.max(1, cards.length - visibleCards + 1);
                currentIndex = Math.max(0, currentIndex - 1);
                if (currentIndex < 0) currentIndex = slides - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const slides = Math.max(1, cards.length - visibleCards + 1);
                currentIndex = Math.min(slides - 1, currentIndex + 1);
                if (currentIndex >= slides) currentIndex = 0;
                updateCarousel();
            });
        }

        // Touch/Swipe support
        let startX = 0;
        let isDragging = false;

        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const diff = startX - e.changedTouches[0].clientX;
            const slides = Math.max(1, cards.length - visibleCards + 1);
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < slides - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }
            isDragging = false;
        }, { passive: true });

        window.addEventListener('resize', () => {
            visibleCards = getVisibleCards();
            const slides = Math.max(1, cards.length - visibleCards + 1);
            if (currentIndex >= slides) currentIndex = slides - 1;
            createDots();
            updateCarousel();
        });

        createDots();
        updateCarousel();

        // Auto-play carousel
        let autoPlay = setInterval(() => {
            const slides = Math.max(1, cards.length - visibleCards + 1);
            currentIndex = (currentIndex + 1) % slides;
            updateCarousel();
        }, 5000);

        // Pause on hover
        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carouselTrack.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                const slides = Math.max(1, cards.length - visibleCards + 1);
                currentIndex = (currentIndex + 1) % slides;
                updateCarousel();
            }, 5000);
        });
    }

    // ---- Cart System ----
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartShopLink = document.getElementById('cartShopLink');

    let cart = [];

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartShopLink) cartShopLink.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    function updateCart() {
        const count = cart.length;
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.classList.toggle('show', count > 0);
        }

        if (cartItems) {
            if (count === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8E6B4D" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <p>Votre écrin est vide</p>
                        <a href="#collection" class="btn btn-outline btn-sm" onclick="document.getElementById('cartDrawer').classList.remove('active');document.getElementById('cartOverlay').classList.remove('active');document.body.style.overflow=''">Découvrir nos pièces</a>
                    </div>`;
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12,2 15,8.5 22,9 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9 9,8.5"/>
                            </svg>
                        </div>
                        <div class="cart-item-details">
                            <p class="cart-item-name">${item.name}</p>
                            <p class="cart-item-price">${Number(item.price).toLocaleString('fr-FR')} €</p>
                            <button class="cart-item-remove" data-index="${index}">Retirer</button>
                        </div>
                    </div>
                `).join('');

                cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.target.dataset.index);
                        cart.splice(idx, 1);
                        updateCart();
                    });
                });

                if (cartFooter) cartFooter.style.display = 'block';
                const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
                if (cartTotal) cartTotal.textContent = total.toLocaleString('fr-FR') + ' €';
            }
        }
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const product = btn.dataset.product;
            const price = btn.dataset.price;
            cart.push({ name: product, price: price });
            updateCart();
            openCart();

            btn.style.background = '#27ae60';
            btn.querySelector('span').textContent = 'Ajouté !';
            setTimeout(() => {
                btn.style.background = '';
                btn.querySelector('span').textContent = 'Ajouter au panier';
            }, 1500);
        });
    });

    // ---- Newsletter ----
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterForm.style.display = 'none';
            if (newsletterSuccess) newsletterSuccess.classList.add('show');
        });
    }

    // ---- Animated Number Counter ----
    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target >= 1000) {
                el.textContent = current.toLocaleString('fr-FR');
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                if (target >= 1000) {
                    el.textContent = target.toLocaleString('fr-FR');
                } else {
                    el.textContent = target;
                }
            }
        }
        requestAnimationFrame(updateCount);
    }

    // ---- Scroll Reveal Animations ----
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Counter observer
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

});
