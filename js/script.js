document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (themeBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            isDark ? document.documentElement.removeAttribute('data-theme') : document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

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

    fetchData();
});

async function fetchData() {
    const API_URL = 'https://api.jour-news.com/api/articles';
    const LOCAL_JSON = 'json/journews_db.articles.json';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        renderArticles(data);
    } catch (err) {
        try {
            const localResponse = await fetch(LOCAL_JSON);
            const localData = await localResponse.json();
            renderArticles(localData);
        } catch (localErr) {
            console.error("Critical: Data load failed.", localErr);
        }
    }
}

function renderArticles(articles) {
    const container = document.getElementById("articlesContainer");
    if (!container) return;
    container.innerHTML = "";
    
    articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "news-card";
        
        const date = article.createdAt?.$date ? new Date(article.createdAt.$date).toLocaleDateString() : '';
        const cleanContent = article.content ? article.content.split('\n')[0] : '';

        articleCard.innerHTML = `
            <div class="news-image"></div>
            <div class="news-content">
                <div class="news-meta">
                    <span>${article.category || 'General'}</span> 
                    <span>${date}</span>
                </div>
                <h2>${article.title}</h2>
                <p>${cleanContent}</p>
                <div class="news-footer">
                    <a href="${article.link || '#'}" target="_blank" class="btn-read-more">Read Full Story →</a>
                </div>
            </div>
        `;
        container.appendChild(articleCard);
    });
}
