const API_BASE = 'https://api.jour-news.com/api/articles';
const CURRENT_PAGE_CATEGORY = 'NGO';
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
        db.articles = (data.status === 'success' && data.data) ? data.data : data;
    } catch (err) {
        try {
            const response = await fetch('json/journews_db.articles.json');
            const json = await response.json();
            db.articles = (json.status === 'success' && json.data) ? json.data : json;
        } catch (jsonErr) {}
    }
    renderAll();
}

async function syncArticle(articleData) {
    try {
        const json = await api.create(articleData);
        if (json.status === 'success') await fetchData();
    } catch (err) {}
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
    const container = document.getElementById("ngoContainer");
    if (!container) return;

    const filtered = db.articles.filter(a => a.category === CURRENT_PAGE_CATEGORY);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-data-msg">No ${CURRENT_PAGE_CATEGORY} records found in the network.</p>`;
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
            <div class="article-content">${article.content}</div>
            <div class="article-footer">
                ${article.link ? `<a href="${article.link}" target="_blank" class="read-more-link">Source Evidence →</a>` : '<span></span>'}
            </div>
        `;
        container.appendChild(articleCard);
    });
}

fetchData();
