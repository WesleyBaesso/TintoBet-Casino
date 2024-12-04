const express = require('express');
const router = express.Router();

// Define the route with a callback function to handle the request
router.get('/:gameType', (req, res) => {
    const gameType = req.params.gameType;
    res.send(`Game type: ${gameType}`);
});

module.exports = router;
