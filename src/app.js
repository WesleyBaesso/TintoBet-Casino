const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const gamesRoutes = require('./routes/api/gamesRoutes');
const userRoutes = require('./routes/api/userRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const auth = require('./middlewares/authMiddleware');

app.use(session({
  secret: '111111111', // use a more secure secret in production
  resave: true,
  saveUninitialized: true,
}));

app.use(cors()); // Enable cross-origin resource sharing for the API
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files (e.g., images, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route for index.html without authentication
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route for login.html without authentication (public route)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Apply auth middleware selectively only on routes that require authentication
app.use('/api/games', auth.authenticateUser, gamesRoutes);  // Games-related actions require authentication
app.use('/api/users', auth.attachUserBalanceToResponse, userRoutes);   // User-related actions require authentication
app.use('/', auth.authenticateUser, pagesRoutes); // Pages require authentication

// Catch-all for handling 404s
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
