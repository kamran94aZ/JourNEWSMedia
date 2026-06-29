const API_BASE = https://api.jour-news.com/api/media;
let db = { articles: [] };

const api = {
    getAll: async (category) => {
        const response = await fetch(`${API_BASE}/${category.toLowerCase()}`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    },
    create: async (payload) => {
        const response = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    }
};

const CURRENT_PAGE_CATEGORY = 'media';

async function fetchData() {
    try {
        const data = await api.getAll(CURRENT_PAGE_CATEGORY);
        db.articles = data;
    } catch (err) {
        console.warn("API unavailable, falling back to local JSON:", err);
        try {
            const response = await fetch('json/journews_db.articles.json');
            const json = await response.json();
            db.articles = json.filter(a => a.category.toLowerCase() === CURRENT_PAGE_CATEGORY);
        } catch (jsonErr) {
            console.error("Local load failed:", jsonErr);
        }
    }
    renderAll();
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

    await syncArticle({ title, content, category: CURRENT_PAGE_CATEGORY, link });
    document.querySelectorAll("#articleTitleInput, #articleContentInput, #articleLinkInput").forEach(el => el.value = "");
}

function renderAll() {
    const container = document.getElementById("mediaContainer");
    if (!container) return;

    if (db.articles.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No ${CURRENT_PAGE_CATEGORY} records found.</p>`;
        return;
    }

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = new Date(article.publishedAt || Date.now()).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        articleCard.innerHTML = `
            <div class="article-meta">
                <span class="category">${article.category || CURRENT_PAGE_CATEGORY}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${article.description || article.content}</div>
            <div class="article-footer">
                ${article.url ? `<a href="${article.url}" target="_blank" class="read-more-link">Source Evidence →</a>` : '<span></span>'}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
