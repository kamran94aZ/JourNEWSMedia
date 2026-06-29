const CURRENT_PAGE_CATEGORY = 'Science';
let db = { articles: [] };

async function fetchData() {
    try {
        const response = await fetch('json/science.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        db.articles = Array.isArray(data) ? data : (data.articles || []);
    } catch (err) {
        console.error("Error loading science.json:", err);
        db.articles = []; 
    }

    renderAll();
}

document.addEventListener('DOMContentLoaded', fetchData);
