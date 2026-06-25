// --- SECURED JAVASCRIPT INTERACTIVITY CONTROL LAYER ---
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'https://jour-news.com/api/articles';

    async function fetchArticles() {
        try {
            const response = await fetch('json/journews_db.articles.json'); 
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Error:", error);
        }
    }

    fetchArticles();
    
    // 1. Theme Switcher with Corrected logic
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme immediately on load
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Toggle theme
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 2. Mobile Navigation with Null-Safe Protection
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
});
