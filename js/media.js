const CURRENT_PAGE_CATEGORY = 'Media';
let db = { articles: [] };

const api = {
    // Fetches directly from your local file with a timestamp to prevent caching
    getAll: async () => {   
        const response = await fetch('json/news.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Network error: Could not load news.json');
        return await response.json();
    }
};

async function fetchData() {
    try {
        const data = await api.getAll();
        // Handles if the JSON is a direct array or an object containing an 'articles' key
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.error("Error loading news:", err);
        db.articles = [];
        const container = document.getElementById("mediaContainer");
        if (container) {
            container.innerHTML = `<p style="color: #ff4a4a;">Failed to load data. Please check the file path.</p>`;
        }
        return; // Stop if data fails to load
    }
    renderAll();
}

function renderAll() {
    const container = document.getElementById("mediaContainer"); 
    if (!container) return;

    if (db.articles.length === 0) {
        container.innerHTML = `<p>No records found.</p>`;
        return;
    }

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        
        // Safely extract content and URL
        const content = article.description || article.content || 'No content available.';
        const link = article.url || article.link;

        articleCard.innerHTML = `
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${content}</div>
            ${link ? `<a href="${link}" target="_blank">Source Evidence →</a>` : ''}
        `;
        container.appendChild(articleCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchData);
