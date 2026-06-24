const API_BASE = 'https://api.jour-news.com/api/articles';
let db = { articles: [] };

const api = {
    getAll: async () => {
        // Keş problemini aradan qaldırmaq üçün ?t=... əlavə olundu
        const response = await fetch('json/journews_db.articles.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    }
};

async function fetchData() {
    try {
        const data = await api.getAll();
        db.articles = Array.isArray(data) ? data : [];
        renderAll();
    } catch (err) {
        console.error("Connection Error:", err);
        const container = document.getElementById("articlesContainer");
        if (container) {
            container.innerHTML = `<p style="color: #ff4a4a;">Failed to load articles.</p>`;
        }
    }
}

function renderAll() {
    const container = document.getElementById("articlesContainer");
    if (!container) return;

    container.innerHTML = "";
    
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        
        const rawDate = article.createdAt && article.createdAt.$date ? article.createdAt.$date : article.createdAt;
        const date = rawDate ? new Date(rawDate).toLocaleDateString() : '';

        articleCard.innerHTML = `
            <div class="article-meta">
                <span>${article.category || 'General'}</span> 
                ${date ? `| <span>${date}</span>` : ''}
            </div>
            <h2>${article.title}</h2>
            <div>${article.content}</div>
            ${article.link ? `<br><a href="${article.link}" target="_blank">Read more</a>` : ''}
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
