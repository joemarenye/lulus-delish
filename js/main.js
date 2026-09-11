// Close the mobile nav once a link is chosen.
document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const toggle = document.getElementById('nav-toggle');
    if (toggle) toggle.checked = false;
  });
});

// ============================================
// Hero carousel + time-aware content
// Uses Mombasa/Kenya time (Africa/Nairobi)
// ============================================

const heroCarousel = document.querySelector('[data-carousel]');

if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.hero__slide');
    const dots = heroCarousel.querySelectorAll('.hero__dot');

    const heroTitle = document.getElementById('hero-title');
    const heroDescription =
        document.getElementById('hero-description');
    const heroPeriod =
        document.getElementById('hero-period');

    const heroImages = [
        document.getElementById('hero-image-1'),
        document.getElementById('hero-image-2'),
        document.getElementById('hero-image-3')
    ];

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // --------------------------------------------
    // Hero content for each operating period
    // --------------------------------------------

    const heroContent = {

        morning: {
            period: 'Morning',
            title: 'Mornings taste better here.',
            description:
                'The first plates come out warm. Mutton soup, mahamri, mbaazi and fresh juice. The kind of breakfast that sets the pace for the day.',
            images: [
                {
                    src: 'images-webp/hero/morning-a.webp',
                    alt: "Mutton soup served at Lulu's Delish"
                },
                {
                    src: 'images-webp/hero/morning-2.webp',
                    alt: "Mahamri and mbaazi breakfast at Lulu's Delish"
                },
                {
                    src: 'images-webp/hero/morning-3.webp',
                    alt: "Coastal breakfast served at Lulu's Delish"
                }
            ]
        },

        afternoon: {
            period: 'Afternoon',
            title: 'By noon, the rice takes over.',
            description:
                'Biryani, pilau, onion rice and slow-cooked meats arrive generous and fragrant, with the flavours of the coast running through every plate.',
            images: [
                {
                    src: 'images-webp/hero/lunch-a.webp',
                    alt: "Chicken biryani served at Lulu's Delish"
                },
                {
                    src: 'images-webp/hero/lunch-2.webp',
                    alt: "Coastal rice dish served at Lulu's Delish"
                },
                {
                    src: 'images-webp/hero/lunch-3.webp',
                    alt: "Lunch at Lulu's Delish in Mombasa"
                }
            ]
        },

        evening: {
            period: 'Evening',
            title: 'There’s still time for one good plate.',
            description:
                'Come in before five for something fresh, something filling, or something to take home. The kitchen is still cooking.',
            images: [
                {
                    src: 'images-webp/hero/evening-a.webp',
                    alt: "Fresh food served at Lulu's Delish"
                },
                {
                    src: 'images-webp/hero/evening-2.webp',
                    alt: "A meal at Lulu's Delish in Mombasa"
                },
                {
                    src: 'images-webp/hero/evening-3.webp',
                    alt: "Fresh juice and food at Lulu's Delish"
                }
            ]
        },

        closed: {
            period: 'Closed',
            title: 'The kitchen is resting.',
            description:
                "Lulu's Delish is open Monday to Friday, from 9am to 5pm. Come back when the pots are on and breakfast is underway.",
            images: [
                {
                    src: 'images-webp/hero/closed-a.webp',
                    alt: "We're closed. Come back later!"
                },
                {
                    src: 'images-webp/hero/closed-2.webp',
                    alt: "We're closed. Come back later!"
                },
                {
                    src: 'images-webp/hero/closed-3.webp',
                    alt: "We're closed. Come back later!"
                }
            ]
        }
    };

    // --------------------------------------------
    // Get current time in Mombasa
    // --------------------------------------------

    function getMombasaTime() {
        const parts = new Intl.DateTimeFormat('en-KE', {
            timeZone: 'Africa/Nairobi',
            weekday: 'short',
            hour: 'numeric',
            hour12: false
        }).formatToParts(new Date());

        const values = {};

        parts.forEach((part) => {
            if (part.type !== 'literal') {
                values[part.type] = part.value;
            }
        });

        return {
            weekday: values.weekday,
            hour: Number(values.hour)
        };
    }

    // --------------------------------------------
    // Determine the current hero period
    // --------------------------------------------

    function getCurrentPeriod() {
        const { weekday, hour } = getMombasaTime();

        const weekend =
            weekday === 'Sat' || weekday === 'Sun';

        // Saturday and Sunday — closed all day
        if (weekend) {
            return 'closed';
        }

        // Monday–Friday — closed before 9 AM
        // and from 5 PM onward
        if (hour < 9 || hour >= 17) {
            return 'closed';
        }

        // Monday–Friday — 9 AM to 12 PM
        if (hour < 12) {
            return 'morning';
        }

        // Monday–Friday — 12 PM to 3 PM
        if (hour < 15) {
            return 'afternoon';
        }

        // Monday–Friday — 3 PM to 5 PM
        return 'evening';
    }

    let currentSlide = 0;
    let currentPeriod = null;
    let timer = null;

    // --------------------------------------------
    // Change carousel slide
    // --------------------------------------------

    function goTo(index) {
        slides[currentSlide].classList.remove('is-active');
        dots[currentSlide].classList.remove('is-active');
        dots[currentSlide].setAttribute(
            'aria-selected',
            'false'
        );

        currentSlide =
            (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('is-active');
        dots[currentSlide].classList.add('is-active');
        dots[currentSlide].setAttribute(
            'aria-selected',
            'true'
        );
    }

    // --------------------------------------------
    // Update hero according to time
    // --------------------------------------------

    function updateHero(force = false) {
        const period = getCurrentPeriod();

        if (!force && period === currentPeriod) {
            return;
        }

        currentPeriod = period;

        const content = heroContent[period];

        heroPeriod.textContent = content.period;
        heroTitle.textContent = content.title;
        heroDescription.textContent =
            content.description;

        content.images.forEach((image, index) => {
            heroImages[index].src = image.src;
            heroImages[index].alt = image.alt;
        });

        // Always begin the new period on slide 1
        currentSlide = 0;

        slides.forEach((slide, index) => {
            slide.classList.toggle(
                'is-active',
                index === 0
            );
        });

        dots.forEach((dot, index) => {
            const active = index === 0;

            dot.classList.toggle(
                'is-active',
                active
            );

            dot.setAttribute(
                'aria-selected',
                active ? 'true' : 'false'
            );
        });
    }

    // --------------------------------------------
    // Autoplay
    // --------------------------------------------

    function start() {
        if (
            prefersReducedMotion ||
            slides.length < 2
        ) {
            return;
        }

        stop();

        timer = setInterval(() => {
            updateHero();
            goTo(currentSlide + 1);
        }, 6000);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // --------------------------------------------
    // Dot navigation
    // --------------------------------------------

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goTo(index);
            start();
        });
    });

    // --------------------------------------------
    // Pause on hover/focus
    // --------------------------------------------

    heroCarousel.addEventListener(
        'mouseenter',
        stop
    );

    heroCarousel.addEventListener(
        'mouseleave',
        start
    );

    heroCarousel.addEventListener(
        'focusin',
        stop
    );

    heroCarousel.addEventListener(
        'focusout',
        start
    );

    // --------------------------------------------
    // Initial state
    // --------------------------------------------

    updateHero(true);

    if (!prefersReducedMotion) {
        start();
    }

    // Check the time every minute.
    // This means the hero can change automatically
    // when 12 PM, 3 PM or 5 PM is reached.
    setInterval(() => {
        updateHero();
    }, 60000);
}

// Horizontal menu category navigation.
const menuNav = document.querySelector('.menu-nav');
const menuSections = document.querySelectorAll('.menu-section');

if (menuNav && menuSections.length) {
  const links = menuNav.querySelectorAll('a');

  links.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      menuSections[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });

      links.forEach((item) => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
}

// Scroll-reveal — fades/slides elements in as they enter the
// viewport. Elements opt in with [data-reveal]; [data-reveal="delay"]
// gets a small extra offset so paired image/copy blocks don't land
// in perfect unison. Under reduced motion, everything is shown
// immediately instead of being observed.
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }
}