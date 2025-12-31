document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navbar = document.querySelector('.navbar');

    // Add active state to navigation on scroll
    const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Theme handling
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const storageKey = 'theme-preference';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const getsStoredTheme = () => localStorage.getItem(storageKey);

    const getPreferredTheme = () => {
        const storedTheme = getsStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return prefersDark.matches ? 'dark' : 'light';
    };

    const applyColorScheme = theme => {
        if ('colorScheme' in root.style) {
            root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
        }
    };

    const reflectTheme = (theme) => {
        const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
        root.setAttribute('data-theme', normalizedTheme);
        applyColorScheme(normalizedTheme);

        if (themeToggle) {
            const isDark = normalizedTheme === 'dark';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('data-theme', normalizedTheme);
        }
    };

    reflectTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(storageKey, newTheme);
            reflectTheme(newTheme);
        });
    }

    const handleSystemThemeChange = event => {
        if (getsStoredTheme()) {
            return;
        }
        reflectTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', handleSystemThemeChange);
    } else if (typeof prefersDark.addListener === 'function') {
        prefersDark.addListener(handleSystemThemeChange);
    }
});
