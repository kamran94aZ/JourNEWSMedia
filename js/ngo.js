const API_BASE = 'https://api.jour-news.com/api/articles';
let db = { articles: [] };

const api = {
    getAll: async () => {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    },
    create: async (payload) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    }
};

async function fetchData() {
    try {
        const json = await api.getAll();
        if (json.status === 'success' && json.data) {
            db.articles = json.data.filter(art => art.category?.toLowerCase() === 'ngo');
        } else {
            db.articles = [];
        }
        renderAll();
    } catch (err) {
        console.error("Database connection error!", err);
        const container = document.getElementById("ngoContainer");
        if (container) container.innerHTML = `<p class="error-msg">Secure connection to MongoDB failed.</p>`;
    }
}

async function syncArticle(articleData) {
    try {
        const json = await api.create(articleData);
        if (json.status === 'success') await fetchData();
    } catch (err) {
        console.error("Synchronization error:", err);
    }
}

async function addArticle() {
    const title = document.getElementById("articleTitleInput")?.value.trim();
    const content = document.getElementById("articleContentInput")?.value.trim();
    const link = document.getElementById("articleLinkInput")?.value.trim();

    if (!title || !content) {
        alert("Title and content are required fields!");
        return;
    }

    await syncArticle({ title, content, category: "NGO", link });
    
    document.querySelectorAll("#articleTitleInput, #articleContentInput, #articleLinkInput").forEach(el => el.value = "");
}

function renderAll() {
    const container = document.getElementById("ngoContainer");
    if (!container) return;

    if (db.articles.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No secure NGO records found in the network.</p>`;
        return;
    }

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = new Date(article.createdAt).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        articleCard.innerHTML = `
            <div class="article-meta">
                <span class="category">${article.category}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${article.content}</div>
            <div class="article-footer">
                ${article.link ? `<a href="${article.link}" target="_blank" class="read-more-link">Source Evidence →</a>` : '<span></span>'}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
