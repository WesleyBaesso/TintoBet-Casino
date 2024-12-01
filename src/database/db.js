const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./src/database/casino.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase(); // Call to create tables
    }
});

// Function to create tables if they don't exist
const initializeDatabase = () => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            profit INTEGER DEFAULT 0, -- How much paintDrops the user has won
            paint_drops INTEGER DEFAULT 0, -- The amount of paint drops the user has
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table is ready.');
        }
    });

    // Blackjack games table
    db.run(`
        CREATE TABLE IF NOT EXISTS blackjack_games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            bet INTEGER NOT NULL, -- The amount the user bet on the game
            result TEXT NOT NULL, -- The result of the game (WIN, LOSS, DRAW)
            win_loss_amount INTEGER NOT NULL,  -- The amount won or lost in the game
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating blackjack_games table:', err.message);
        } else {
            console.log('Blackjack games table is ready.');
        }
    });

    // Roulette games table
    db.run(`
        CREATE TABLE IF NOT EXISTS roulette_games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            bet INTEGER NOT NULL, -- The amount the user bet on the game
            result TEXT NOT NULL, -- The result of the game (WIN, LOSS, DRAW)
            win_loss_amount INTEGER NOT NULL,  -- The amount won or lost in the game
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating roulette_games table:', err.message);
        } else {
            console.log('Roulette games table is ready.');
        }
    });

    // SlotMachine games table
    db.run(`
        CREATE TABLE IF NOT EXISTS slotmachine_games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            bet INTEGER NOT NULL, -- The amount the user bet on the game
            result TEXT NOT NULL, -- The result of the game (WIN, LOSS, DRAW)
            win_loss_amount INTEGER NOT NULL,  -- The amount won or lost in the game
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating slotmachine_games table:', err.message);
        } else {
            console.log('SlotMachine games table is ready.');
        }
    });

    // Crash games table
    db.run(`
        CREATE TABLE IF NOT EXISTS crash_games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            bet INTEGER NOT NULL, -- The amount the user bet on the game
            result TEXT NOT NULL, -- The result of the game (WIN, LOSS, DRAW)
            win_loss_amount INTEGER NOT NULL,  -- The amount won or lost in the game
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating crash_games table:', err.message);
        } else {
            console.log('Crash games table is ready.');
        }
    });
};

// Export the database connection to be used in other parts of the application
module.exports = db;
