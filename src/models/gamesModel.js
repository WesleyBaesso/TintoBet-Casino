// src/models/userModel.js
const db = require('../database/db');  // Database connection

// Function to get user data
const getUserByUsername = (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Function to update the user's balance
const updateBalance = (username, newBalance, callback) => {
    db.run('UPDATE users SET paint_drops = ? WHERE username = ?', [newBalance, username], function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { message: 'Balance updated successfully', updatedRows: this.changes });
        }
    });
};

module.exports = { getUserByUsername, updateBalance };
