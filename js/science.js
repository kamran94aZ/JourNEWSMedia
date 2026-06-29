const API_BASE = https://api.jour-news.com/api/science';
const CURRENT_PAGE_CATEGORY = 'science';
let db = { articles: [] };

const api = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/${CURRENT_PAGE_CATEGORY}`);
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

async function fetchData() {
    try {
        const data = await api.getAll();
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.warn("API unavailable, falling back to local JSON:", err);
        try {
            const response = await fetch('json/journews_db.articles.json');
            const json = await response.json();
            db.articles = (Array.isArray(json) ? json : (json.articles || [])).filter(a => a.category?.toLowerCase() === CURRENT_PAGE_CATEGORY);
        } catch (jsonErr) {
            console.error("Local load failed:", jsonErr);
        }
    }
    renderAll();
}

async function syncArticle(articleData) {
    try {
        const json = await api.create(articleData);
        if (json) await fetchData();
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
    const container = document.getElementById("scienceContainer");
    if (!container) return;

    const filtered = db.articles;

    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No ${CURRENT_PAGE_CATEGORY} records found in the network.</p>`;
        return;
    }

    container.innerHTML = "";
    filtered.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString("en-US", {
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
                ${article.url || article.link ? `<a href="${article.url || article.link}" target="_blank" class="read-more-link">Source Evidence →</a>` : '<span></span>'}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
