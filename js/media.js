/**
 * Media Hub Controller
 * Loads news directly from json/news.json
 */

const CURRENT_PAGE_CATEGORY = 'Media';
let db = { articles: [] };

async function fetchData() {
    console.log("Fetching news from local JSON...");
    
    try {
        
        const response = await fetch('json/news.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        db.articles = Array.isArray(data) ? data : (data.articles || []);
        
        console.log("Success! Articles loaded:", db.articles.length);
    } catch (err) {
        console.error("Error loading JSON file:", err);
       
        db.articles = [];
    }

    renderAll();
}


document.addEventListener('DOMContentLoaded', fetchData);
