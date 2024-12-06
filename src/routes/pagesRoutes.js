const express = require('express');
const path = require('path');
const router = express.Router();

// Define the route to serve HTML files for specific games
router.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName;

    // Validate pageName to prevent directory traversal attacks
    const validPages = ['crash', 'blackjack', 'slot-machine']; // Define your valid pages
    if (!validPages.includes(pageName)) {
        return res.status(404).send('Page not found');
    }

    const filePath = path.join(__dirname, '..', '..', 'public', `${pageName}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Page not found');
        }
    });
});

module.exports = router;
