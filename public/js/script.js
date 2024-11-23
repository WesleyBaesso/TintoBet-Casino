// server.js or wherever your routes are handled

const express = require('express');
const db = require('./database/db.js');  // Your database connection file
const app = express();
app.use(express.json());

// Route to authenticate user and send user data (for example)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check the user credentials (assuming you have password hashing in place)
    const query = `SELECT id, username, paint_drops FROM users WHERE username = ? AND password = ?`;
    
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error querying the database' });
        }
        if (row) {
            // If user is found, send back the user data (username and paint_drops)
            return res.json({
                username: row.username,
                paintDrops: row.paint_drops
            });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

