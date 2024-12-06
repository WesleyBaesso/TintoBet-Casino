const db = require('../database/db');

const registerUser = (username, password) => {
    return new Promise((resolve, reject) => {
        // Query to check if the username already exists
        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        db.get(checkQuery, [username], (err, existingUser) => {
            if (err) {
                return reject(err); // Reject if there's an error in the query
            }

            if (existingUser) {
                return reject(new Error('Username is already taken')); // Reject if the user exists
            }

            // If username doesn't exist, proceed with the registration
            const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.run(insertQuery, [username, password], function(err) {
                if (err) {
                    return reject(err); // Reject if there's an error in the insertion
                }
                
                // Resolve with a success message or the inserted data if needed
                resolve({ username, message: 'User registered successfully' });
            });
        });
    });
};


const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getUserBalance = async (username) => {
    const query = 'SELECT paint_drops FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err); // Reject if there's an error
            } else {
                resolve(row ? row.paint_drops : 0); // Return the balance or 0 if no row found
            }
        });
    });
};

// Function to update a user's paint_drops balance
const updateUserBalance = (username, credits) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the current balance of the user
            const currentBalance = await getUserBalance(username);

            // Add the credits to the current balance
            const newBalance = currentBalance + credits;

            // Update the balance in the database
            const updateQuery = 'UPDATE users SET paint_drops = ? WHERE username = ?';
            
            db.run(updateQuery, [newBalance, username], function(err) {
                if (err) {
                    return reject(err); // Reject if there's an error in the update
                }

                // Check if the user exists and was updated
                if (this.changes === 0) {
                    return reject(new Error('User not found')); // Reject if no rows were updated
                }

                // Resolve with the updated balance and a success message
                resolve({ username, newBalance, message: 'Balance updated successfully' });
            });
        } catch (error) {
            reject(error); // Reject if an error occurs while fetching the balance or updating
        }
    });
};

module.exports = { registerUser, findUserByUsername, getUserBalance, updateUserBalance };
