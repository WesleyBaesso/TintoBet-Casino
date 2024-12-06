const express = require('express');
const userController = require('../../controllers/userController');
const auth = require('../../middlewares/authMiddleware'); // Import your auth middleware
const router = express.Router();

// Routes that do NOT require authentication
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Route to get user info (requires authentication)
router.get('/user-info', auth.authenticateUser, (req, res) => {
    if (!res.locals.user) {
        return res.status(401).json({ error: 'Unauthorized' }); // User not authenticated
    }

    const { username, balance } = res.locals.user; // Assuming balance is stored in session or database
    res.json({ username, balance });
});

// Route to update user balance (requires authentication)
router.post('/update-user-balance', auth.authenticateUser, userController.updateBalance);

module.exports = router;
