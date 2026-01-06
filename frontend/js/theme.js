// Sistema de tema claro/escuro
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Verificar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Alternar tema
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
    }
}

// Configurar sidebar
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Dropdown menu
const dropdowns = document.querySelectorAll('.dropdown-toggle');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = dropdown.parentElement;
        const subMenu = parent.querySelector('.sub-menu');
        
        parent.classList.toggle('active');
        subMenu.classList.toggle('show');
    });
});

// Mobile menu toggle (para telas pequenas)
function setupMobileMenu() {
    if (window.innerWidth <= 768) {
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }
    }
}

window.addEventListener('resize', setupMobileMenu);
setupMobileMenu();