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


    const newsContainer = document.getElementById('news');
    if (newsContainer) {
        fetch('json/journews_db.articles.json')
            .then(res => res.json())
            .then(articles => {
                newsContainer.innerHTML = articles.map(a => `
                    <article class="news-card">
                        <div class="news-content">
                            <h2>${a.title}</h2>
                            <p>${a.content.substring(0, 150)}...</p>
                            <a href="article.html?id=${a.id}" class="btn-read-more">Read Full Story →</a>
                        </div>
                    </article>
                `).join('');
            });
    }


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
            });
    }
});
