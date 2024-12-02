const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const gamesRoutes = require('./routes/api/gamesRoutes');
const userRoutes = require('./routes/api/userRoutes');
const gamesPagesRoutes = require('./routes/gamesPagesRoutes');
const auth = require('./middlewares/authMiddleware');

// Middlewares
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(auth); // Apply auth middleware
app.use(cors()); // Enable cross-origin resource sharing for the API
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files (e.g., images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/games', gamesRoutes); // Routes for game-related actions
app.use('/api/users', userRoutes);   // Routes for user-related actions
app.use('/gamesPages', gamesPagesRoutes); // Routes for rendering games pages

// Catch-all for handling 404s
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
