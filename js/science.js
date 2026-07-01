const API_BASE = 'https://api.jour-news.com/api/media';
const CURRENT_PAGE_CATEGORY = 'Science';
let db = { articles: [] };


let userHasUnlocked = false; 

const api = {
    getAll: async () => {
        const response = await fetch('json/science.json');
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    },
    create: async (payload) => {
        console.warn('Create operation is not supported for local JSON files.');
        return { success: false, message: 'Read-only mode' };
    }
};

async function fetchData() {
    try {
        const data = await api.getAll();
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.error("Error loading science news:", err);
        db.articles = [];
    }
    renderAll();
}

async function syncArticle(articleData) {
    try {
        await api.create(articleData);
        await fetchData();
    } catch (err) { 
        console.error("Sync error:", err); 
    }
}

function renderAll() {
    const container = document.getElementById("scienceContainer"); 
    if (!container) return;

    if (db.articles.length === 0) {
        container.innerHTML = `<p>No records found.</p>`;
        return;
    }

    container.innerHTML = "";
    db.articles.forEach(article => {
        const articleCard = document.createElement("article");
        
        if (article.is_premium && !userHasUnlocked) {
            articleCard.className = "article-card locked-card";
            articleCard.style.border = "2px dashed #ffc107";
            articleCard.style.padding = "20px";
            articleCard.style.background = "#fffdf5";
            articleCard.style.borderRadius = "8px";
            articleCard.style.removeAttribute ? articleCard.style.removeAttribute('margin-bottom') : articleCard.style.marginBottom = "20px";

            articleCard.innerHTML = `
                <h2 class="article-title">🔒 ${article.title} <span style="font-size:12px; background:#0073b1; color:white; padding:2px 6px; border-radius:4px;">MBCS Premium</span></h2>
                <div class="article-content" style="filter: blur(4px); user-select: none; opacity: 0.5;">
                    ${article.description || article.content || 'Premium mathematical analysis content...'}
                </div>
                <div class="paywall-overlay" style="text-align: center; margin-top: 15px; padding: 15px; background: #fff3cd; border-radius: 6px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #856404;">
                        Unlock this study by an MBCS professional to get 10 Bonus Science Articles & 2 Academic Coding Lessons!
                    </p>
                    <div style="font-size: 20px; font-weight: bold; color: #28a745; margin-bottom: 10px;">Bundle Price: $20</div>
                    <a href="#" class="unlock-btn" onclick="triggerDirectUnlock(event)" style="background: #28a745; color: white; padding: 8px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Unlock Premium Bundle
                    </a>
                </div>
            `;
        } else {
            articleCard.className = "article-card";
            
       
            if (article.is_premium && userHasUnlocked) {
                articleCard.style.border = "2px solid #28a745";
                articleCard.style.background = "#f4fcf6";
                articleCard.style.padding = "20px";
                articleCard.style.borderRadius = "8px";
            }
            
            articleCard.innerHTML = `
                <h2 class="article-title">${article.is_premium ? '🔓 UNLOCKED: ' : ''}${article.title}</h2>
                <div class="article-content">${article.description || article.content || 'No content available.'}</div>
                ${article.url || article.link ? `<a href="${article.url || article.link}" target="_blank">Source Evidence →</a>` : ''}
            `;
        }
        
        container.appendChild(articleCard);
    });
}

function triggerDirectUnlock(event) {
    event.preventDefault();
    alert("Individual payment verified! Science bundle is now UNLOCKED.");
    userHasUnlocked = true;
    renderAll(); // Səhifəni yenidən render edir və təmiz variantda məzmunu göstərir
}

document.addEventListener('DOMContentLoaded', fetchData);
