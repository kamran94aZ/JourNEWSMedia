const API_BASE = 'https://api.jour-news.com/api/articles';
let db = { articles: [] };

const api = {
    getAll: async () => {
        const response = await fetch('json/journews_db.articles.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    }
};

async function fetchData(filterCategory = null) {
    try {
        const data = await api.getAll();
        db.articles = Array.isArray(data) ? data : [];
        
       
        const filteredArticles = filterCategory 
            ? db.articles.filter(a => a.category && a.category.toLowerCase() === filterCategory.toLowerCase())
            : db.articles;
        
        renderArticles(filteredArticles);
    } catch (err) {
        console.error("Connection Error:", err);
        const container = document.getElementById("articlesContainer");
        if (container) {
            container.innerHTML = `<p style="color: #ff4a4a;">Failed to load articles.</p>`;
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
        
        const rawDate = article.createdAt && article.createdAt.$date ? article.createdAt.$date : article.createdAt;
        const date = rawDate ? new Date(rawDate).toLocaleDateString() : '';

        articleCard.innerHTML = `
            <div class="news-content">
                <div class="news-meta">
                    <span>${article.category || 'General'}</span> 
                    ${date ? `<span>${date}</span>` : ''}
                </div>
                <h2>${article.title}</h2>
                <p>${article.content}</p>
                <div class="news-footer">
                    <a href="${article.link}" target="_blank" class="btn-read-more">Source Evidence</a>
                </div>
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
