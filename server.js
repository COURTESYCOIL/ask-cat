const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = './database.json';

// Function to read the database
const readDB = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// Function to write to the database
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET endpoint to retrieve user data
app.get('/api/progress/:userId', (req, res) => {
    const db = readDB();
    const userId = req.params.userId;
    const userData = db[userId] || {
        interactionCount: 0,
        unlockedAchievements: {}
    };
    res.json(userData);
});

// POST endpoint to save user data
app.post('/api/progress/:userId', (req, res) => {
    const db = readDB();
    const userId = req.params.userId;
    db[userId] = req.body;
    writeDB(db);
    res.status(200).send('Progress saved.');
});

// DELETE endpoint to delete user data
app.delete('/api/progress/:userId', (req, res) => {
    const db = readDB();
    const userId = req.params.userId;
    if (db[userId]) {
        delete db[userId];
        writeDB(db);
        res.status(200).send('Progress deleted.');
    } else {
        res.status(404).send('User not found.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
