const express = require('express');
const router = express.Router();

// Placeholder route for getting user details
router.get('/', (req, res) => {
  res.status(200).json({ message: 'User endpoint is working!' });
});

// Placeholder route for creating a new user
router.post('/', (req, res) => {
  res.status(201).json({ message: 'User created!' });
});

module.exports = router;
