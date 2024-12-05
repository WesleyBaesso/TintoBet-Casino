const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await userModel.registerUser(username, hashedPassword);
        res.status(201).json({ message: 'Registration successful' }); // Inform frontend of success
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' }); // Send error message
    }
};

const  login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findUserByUsername(username);

        if (!user) {
            console.log(`User not found: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            req.session.user = user; // Save user in session
            console.log(`User logged in: ${username}`);
            return res.status(200).json({ message: 'Login successful' });
        } else {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
