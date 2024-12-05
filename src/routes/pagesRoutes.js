const express = require('express');
const path = require('path');
const router = express.Router();

// Define the route to serve HTML files for specific games
router.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName;

    // Construct the file path based on the pageName
    const filePath = path.join(__dirname, '..', '..', 'public', `${pageName}.html`);

    // Send the file if it exists
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Page not found');
        }
    });
});

module.exports = router;
