const db = require('../database/db');

const registerUser = async (username, password) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    return db.run(query, [username, password]);
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


module.exports = { registerUser, findUserByUsername };
