/* ============================================
   ÉCLAT MODERNE — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

    // ---- Navigation Scroll ----
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
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
        const totalSlides = Math.max(1, cards.length - visibleCards + 1);

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
        // Update count
        const count = cart.length;
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.classList.toggle('show', count > 0);
        }

        // Update items
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

                // Remove listeners
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

            // Brief visual feedback
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

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});
