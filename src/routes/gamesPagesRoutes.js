const express = require('express');
const path = require('path');
const router = express.Router();

// Define the route to serve HTML files for specific games
router.get('/:gameType', (req, res) => {
    const gameType = req.params.gameType;

    // Construct the file path based on the gameType
    const filePath = path.join(__dirname, '..', '..', 'public', `${gameType}.html`);

    // Send the file if it exists
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Page not found');
        }
    });
});

module.exports = router;
