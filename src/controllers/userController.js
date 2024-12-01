const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await userModel.registerUser(username, hashedPassword);
        res.redirect('/login.html');
    } catch (error) {
        res.status(500).send('Registration failed');
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findUserByUsername(username);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user; // Save user in session
        res.redirect('/'); // Redirect to main page
    } else {
        res.status(401).send('Invalid credentials');
    }
};

module.exports = { register, login };
