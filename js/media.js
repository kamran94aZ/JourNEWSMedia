const API_BASE = 'https://api.jour-news.com/api/media';
const CURRENT_PAGE_CATEGORY = 'Media';
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
        const data = await api.getAll();
        // Ensure we always have an array of articles
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.error("API Fetch Error:", err);
        try {
            const response = await fetch('json/journews_db.articles.json');
            const json = await response.json();
            db.articles = Array.isArray(json) ? json : (json.articles || []);
        } catch (jsonErr) {
            console.error("Local file error:", jsonErr);
        }
    }
    renderAll();
}

async function syncArticle(articleData) {
    try {
        await api.create(articleData);
        await fetchData();
    } catch (err) {
        console.error("Sync Error:", err);
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
    // Clear input fields after submission
    document.querySelectorAll("#articleTitleInput, #articleContentInput, #articleLinkInput").forEach(el => el.value = "");
}

function renderAll() {
    const container = document.getElementById("ngoContainer");
    if (!container) return;

    // Normalize data: ensure every article has a category
    const filtered = db.articles.map(a => ({
        ...a,
        category: a.category || CURRENT_PAGE_CATEGORY 
    }));

    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No ${CURRENT_PAGE_CATEGORY} records found.</p>`;
        return;
    }

    container.innerHTML = "";
    filtered.forEach(article => {
        const articleCard = document.createElement("article");
        articleCard.className = "article-card";
        const date = new Date(article.createdAt || Date.now()).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        articleCard.innerHTML = `
            <div class="article-meta">
                <span class="category">${article.category}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="article-title">${article.title}</h2>
            <div class="article-content">${article.content || article.description || ""}</div>
            <div class="article-footer">
                ${article.link || article.url ? `<a href="${article.link || article.url}" target="_blank" class="read-more-link">Source Evidence →</a>` : '<span></span>'}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
