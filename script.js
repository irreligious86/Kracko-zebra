document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function activate(id) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        sections.forEach(s => s.classList.toggle('active', s.id === id));
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            activate(id);
            history.replaceState(null, '', '#' + id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    const initial = window.location.hash ? window.location.hash.substring(1) : 'overview';
    activate(initial);
});
