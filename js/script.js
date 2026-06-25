document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark/Light Mode
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.hasAttribute('data-theme');
            isDark ? document.documentElement.removeAttribute('data-theme') : document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    // 2. Mobile Menu
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

fetch('json/journews_db.articles.json')
    .then(res => res.json())
    .then(articles => {
        console.log("Məqalələr yükləndi:", articles); // Əgər konsolda bunu görürsənsə, deməli məlumat gəlir
        newsContainer.innerHTML = articles.map(a => `
            <article class="news-card">
                <div class="news-content">
                    <h2>${a.title}</h2>
                    <p>${a.content.substring(0, 150)}...</p>
                    <a href="article.html?id=${a.id}" class="btn-read-more">Read Full Story →</a>
                </div>
            </article>
        `).join('');
    })
    .catch(err => console.error("Xəta baş verdi:", err)); // Əgər xəta varsa, burada görəcəksən
    // 4. Load Specific Article (Article Page)
    const titleEl = document.getElementById('article-title');
    if (titleEl) {
        const id = new URLSearchParams(window.location.search).get('id');
        fetch('json/journews_db.articles.json')
            .then(res => res.json())
            .then(articles => {
                const article = articles.find(a => a.id == id);
                if (article) {
                    titleEl.innerText = article.title;
                    document.getElementById('article-content').innerHTML = article.content;
                }
            })
            .catch(err => console.error("Error loading specific article:", err));
    }
});
