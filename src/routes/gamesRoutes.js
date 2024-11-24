const express = require('express');
const router = express.Router();

// Placeholder route for getting all games
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Games endpoint is working!' });
});

// Placeholder route for creating a new game
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Game created!' });
});

module.exports = router;
