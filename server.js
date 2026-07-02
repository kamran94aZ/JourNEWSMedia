const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const API_KEY = process.env.NEWS_API_KEY;
const PORT = process.env.PORT || 8080;

// CORS konfiqurasiyası
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// News storage
let newsData = {
    news: [],
    technology: [],
    science: [],
    media: []
};

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

async function updateAllNews() {
    await fetchNewsByCategory('news', 'general');
    await fetchNewsByCategory('technology', 'technology');
    await fetchNewsByCategory('science', 'science');
    await fetchNewsByCategory('media', 'business');
}

updateAllNews();
setInterval(updateAllNews, 3600000);

app.use(express.static(__dirname));

app.get('/api/:category', (req, res) => {
    const category = req.params.category;
    if (newsData[category]) {
        res.json(newsData[category]);
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
