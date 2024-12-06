const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { username, password } = req.body;
    console.log('Registering user:', username);  // Log the username being registered
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const response = await userModel.registerUser(username, hashedPassword);
        console.log('Registration Response:', response);
        res.status(201).json(response);  // Send the response from registerUser
    } catch (error) {
        console.error('Error during registration:', error);
        if (error.message === 'Username already exists') {
            return res.status(409).json({ message: 'Username is already taken' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
};


const login = async (req, res) => {
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

const logout = (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
                return res.status(500).json({ message: 'Logout failed' });
            }
            console.log('User logged out successfully');
            res.clearCookie('connect.sid'); // Clear session cookie (if using connect.sid by default)
            return res.status(200).json({ message: 'Logout successful' });
        });
    } else {
        console.log('No user session to log out');
        res.status(400).json({ message: 'No active session' });
    }
};

module.exports = { register, login, logout };

