const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const API_KEY = process.env.NEWS_API_KEY;
const PORT = process.env.PORT || 3000;




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});

// News storage
let newsData = {
    news: [],
    technology: [],
    science: [],
    media: []
};

/**
 * Fetches news from NewsAPI by category
 */
async function fetchNewsByCategory(category, query) {
    try {
        const url = `https://newsapi.org/v2/top-headlines?category=${query}&language=en&apiKey=${API_KEY}`;
        const response = await axios.get(url);
        newsData[category] = response.data.articles;
        console.log(`Successfully updated: ${category}`);
    } catch (error) {
        console.error(`Error updating ${category}:`, error.message);
    }
}

/**
 * Updates all news categories
 */
async function updateAllNews() {
    await fetchNewsByCategory('news', 'general');
    await fetchNewsByCategory('technology', 'technology');
    await fetchNewsByCategory('science', 'science');
    await fetchNewsByCategory('media', 'business');
}

// Initial fetch and set interval (1 hour)
updateAllNews();
setInterval(updateAllNews, 3600000);

// Serve static files from root directory
app.use(express.static(__dirname));

// API endpoint to serve cached news
app.get('/api/:category', (req, res) => {
    const category = req.params.category;
    if (newsData[category]) {
        res.json(newsData[category]);
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
