const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.NEWS_API_KEY;
const PORT = process.env.PORT || 3000;

// News storage
let newsData = {
    news: [],
    technology: [],
    science: [],
    media: []
};

/**
 * Fetches news from NewsAPI by category
 * 'general' is used for top news as 'news' category doesn't exist in API
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

// Serve static files from 'public' directory
app.use(express.static('public'));

// API endpoint to serve cached news
app.get('/api/:category', (req, res) => {
    const category = req.params.category;
    if (newsData[category]) {
        res.json(newsData[category]);
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
