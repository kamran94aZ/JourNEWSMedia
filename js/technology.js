// Removed dead external API_BASE
let db = { articles: [] };

const api = {
    // Fetches from the specified local file
    getAll: async () => {
        const response = await fetch('json/journews_db.articles.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Network error: Cannot load local database');
        return await response.json();
    }
};

async function fetchData() {
    try {
        const json = await api.getAll();
        
        // Safely handles array or nested object structure
        db.articles = Array.isArray(json) ? json : (json.data || json.articles || []);
        renderAll();
    } catch (err) {
        console.error("Connection Error:", err);
        const container = document.getElementById("technologyContainer");
        if (container) {
            container.innerHTML = `<p class="no-data-msg" style="color: #ff4a4a;">Error loading technology data.</p>`;
        }
    }
}

function renderAll() {
    const container = document.getElementById("technologyContainer");
    if (!container) return;

    // Filter articles for 'technology' category
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
        
        // Handle date, considering potential MongoDB $date object format
        const rawDate = (article.createdAt && article.createdAt.$date) ? article.createdAt.$date : article.createdAt;
        const date = rawDate ? new Date(rawDate).toLocaleDateString("en-US") : '';

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
