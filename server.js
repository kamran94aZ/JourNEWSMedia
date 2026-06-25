const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['https://jour-news.com', 'https://www.jour-news.com']
}));
app.use(express.json());

const jsonFilePath = path.join(__dirname, 'json', 'user.json');

if (!fs.existsSync(path.join(__dirname, 'json'))) {
    fs.mkdirSync(path.join(__dirname, 'json'));
}
if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
}

app.post('/api/register', (req, res) => {
    const { fullName, email, phone, title, organization, createdAt } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (e) {
            users = [];
        }

        users.push({ fullName, email, phone, title, organization, createdAt });

        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Failed to save data." });
            }
            return res.status(200).json({ message: "Registration successful! Data saved to JSON." });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});