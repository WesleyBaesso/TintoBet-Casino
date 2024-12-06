const express = require('express');
const userController = require('../../controllers/userController');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout)
router.get('/user-info', (req, res) => {
    if (!res.locals.user) {
        return res.status(401).json({ error: 'Unauthorized' }); // User not authenticated
    }

    const { username, balance } = res.locals.user; // Assuming balance is stored in session or database
    res.json({ username, balance });
});

module.exports = router;