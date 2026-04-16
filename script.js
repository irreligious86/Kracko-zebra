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

    /* закривати drawer при переході на десктопний розмір */
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
});
