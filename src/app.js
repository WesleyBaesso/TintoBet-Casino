const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const gamesRoutes = require('./routes/gamesRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/auth');

// Middlewares
app.use(cors()); // Enable cross-origin resource sharing for the API
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files (e.g., images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/games', gamesRoutes); // Routes for game-related actions
app.use('/api/user', userRoutes);   // Routes for user-related actions

// Authentication middleware (if applicable, protecting certain routes)
app.use('/api/protected', authMiddleware);

// Catch-all for handling 404s
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
