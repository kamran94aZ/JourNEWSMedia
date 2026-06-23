const API_BASE = 'https://api.jour-news.com/api/articles';
let db = { articles: [] };

const api = {
    getAll: async () => {
        const response = await fetch('json/journews_db.articles.json');
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    }
};

async function fetchData() {
    try {
        const json = await api.getAll();
        // Məlumatı array kimi qəbul edirik
        db.articles = Array.isArray(json) ? json : (json.data || []);
        renderAll();
    } catch (err) {
        console.error("Connection Error:", err);
    }
}

function renderAll() {
    const container = document.getElementById("technologyContainer");
    if (!container) return;

    // Həmin səhifəyə aid olan məqalələri filter edirik
    // Məsələn, bu səhifə "Technology" kateqoriyasıdırsa:
    const filteredArticles = db.articles.filter(article => 
        article.category && article.category.toLowerCase() === 'technology'
    );

    if (filteredArticles.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No articles found in this category.</p>`;
        return;
    }

    container.innerHTML = "";
    filteredArticles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString("en-US") : '';

        articleCard.innerHTML = `
            <div class="article-meta">
                <span class="category">${article.category}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${article.content}</div>
            <div class="article-footer">
                ${article.link ? `<a href="${article.link}" target="_blank" class="read-more-link">Read more</a>` : ''}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
