const API_URL = 'https://api.jour-news.com/api/news'; 
let db = { articles: [] };

const api = {
    getAll: async () => {   
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    },
    create: async (payload) => {
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    }
};

async function fetchData() {
    try {
        const data = await api.getAll();
        // Serverdən gələn cavabı olduğu kimi götür
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.warn("API Error:", err);
        // API işləmirsə, local faylı yoxla
        try {
            const response = await fetch('json/journews_db.articles.json');
            const json = await response.json();
            db.articles = Array.isArray(json) ? json : (json.articles || []);
        } catch (jsonErr) {}
    }
    renderAll();
}

async function syncArticle(articleData) {
    try {
        await api.create(articleData);
        await fetchData();
    } catch (err) { console.error(err); }
}

function renderAll() {

    const container = document.getElementById("newsContainer");
    if (!container) return;

    if (db.articles.length === 0) {
        container.innerHTML = `<p>No records found.</p>`;
        return;
    }

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        
        articleCard.innerHTML = `
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${article.description || article.content}</div>
            ${article.url || article.link ? `<a href="${article.url || article.link}" target="_blank">Source Evidence →</a>` : ''}
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
