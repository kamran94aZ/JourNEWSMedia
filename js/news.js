const CURRENT_PAGE_CATEGORY = 'Global News';
let db = { articles: [] };

const api = {
    getAll: async () => {   
        const response = await fetch('json/news.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    }
};
async function fetchData() {
    try {
        const data = await api.getAll();
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.error("Error loading news:", err);
        db.articles = [];
    }
    renderAll();
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
            <div class="article-content">${article.description || article.content || 'No content available.'}</div>
            ${article.url || article.link ? `<a href="${article.url || article.link}" target="_blank">Source Evidence →</a>` : ''}
        `;
        container.appendChild(articleCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchData);
