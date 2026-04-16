document.addEventListener('DOMContentLoaded', () => {
    /* ---------- навігація по розділах ---------- */
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');

    function activateSection(id) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        sections.forEach(s => s.classList.toggle('active', s.id === id));
    }

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            activateSection(id);
            history.replaceState(null, '', '#' + id);
            closeSidebar();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    menuToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900) closeSidebar();
    });

    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'ground';
    activateSection(initialSection);

    /* ---------- перемикач тем ---------- */
    const themeButtons = document.querySelectorAll('.theme-btn');
    const THEME_KEY = 'krackozebra-theme';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
        localStorage.setItem(THEME_KEY, theme);
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    /* ---------- PWA: service worker ---------- */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.warn('Service Worker не зареєстровано:', err);
            });
        });
    }

    /* ---------- PWA: кнопка встановлення ---------- */
    const installBtn = document.getElementById('installBtn');
    const installHint = document.getElementById('installHint');
    let deferredPrompt = null;

    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (!isStandalone) {
            installBtn.hidden = false;
            installHint.hidden = true;
        }
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        installBtn.disabled = true;
        deferredPrompt.prompt();
        try {
            await deferredPrompt.userChoice;
        } finally {
            deferredPrompt = null;
            installBtn.hidden = true;
            installBtn.disabled = false;
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        installBtn.hidden = true;
        installHint.hidden = true;
    });

    if (isIOS && !isStandalone) {
        installHint.hidden = false;
    }
});
