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
    },
    delete: async (id) => {
        const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        return await response.json();
    }
};

async function fetchData() {
    try {
        const response = await fetch('json/journews_db.articles.json');
        const json = await response.json();
        
        db.articles = (json.status === 'success' && json.data) ? json.data : json;
        
        renderAll();
    } catch (err) {
        console.error("Connection Error:", err);
        const container = document.getElementById("articlesContainer");
        if (container) container.innerHTML = `<p style="color: #ff4a4a;">Connection failed.</p>`;
    }
}

async function addArticle() {
    const title = document.getElementById("articleTitleInput")?.value.trim();
    const content = document.getElementById("articleContentInput")?.value.trim();
    const category = document.getElementById("articleCategoryInput")?.value.trim() || "General";
    const link = document.getElementById("articleLinkInput")?.value.trim();

    if (!title || !content) return;

    try {
        await api.create({ title, content, category, link });
        document.querySelectorAll("input, textarea").forEach(el => el.value = "");
        await fetchData();
    } catch (err) {
        console.error("Sync error:", err);
    }
}

async function deleteArticle(id) {
    if (!confirm("Confirm permanent deletion?")) return;
    try {
        const json = await api.delete(id);
        if (json.status === 'success') await fetchData();
    } catch (err) {
        console.error("Delete error:", err);
    }
}

function renderAll() {
    const container = document.getElementById("articlesContainer");
    if (!container) return;

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = new Date(article.createdAt).toLocaleDateString();

        articleCard.innerHTML = `
            <div class="article-meta">
                <span>${article.category}</span> | <span>${date}</span>
            </div>
            <h2>${article.title}</h2>
            <div>${article.content}</div>
            <button onclick="deleteArticle('${article._id}')">Delete</button>
            ${article.link ? `<a href="${article.link}" target="_blank">Source</a>` : ''}
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
