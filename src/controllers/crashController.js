let gameStorage = {}; // Store active game states in memory
let notifyCrash = null; // Callback for notifying the crash to the frontend

// Set the callback function to notify WebSocket about the crash event
const setNotifyCrashCallback = (callback) => {
    notifyCrash = callback;
};

// Start a new crash game
const startGame = async (betAmount) => {
    if (!betAmount || betAmount <= 0) {
        throw new Error('Invalid bet amount');
    }

    const gameId = generateGameId(); // Generate a unique game ID
    const startTime = Date.now();
    const crashMultiplier = Math.random() * 3 + 1; // Set random crash multiplier between 1 and 4 (example)

    gameStorage[gameId] = {
        betValue: betAmount,
        crashMultiplier,
        startTime,
    };

    return {
        gameId,
        startTime,
        crashMultiplier,
    };
};

// Stop the game if it crashes
const stopGame = async (gameId) => {
    const game = gameStorage[gameId];
    if (!game) throw new Error('Game not found');

    const { betValue, crashMultiplier, startTime } = game;
    const elapsedTime = (Date.now() - startTime) / 1000;
    const currentMultiplier = parseFloat((elapsedTime * 0.1 + 1).toFixed(2));

    // Check if the game has crashed
    if (currentMultiplier >= crashMultiplier) {
        delete gameStorage[gameId]; // Game crashed, so delete it from storage
        if (notifyCrash) {
            notifyCrash(gameId, crashMultiplier);  // Notify frontend of the crash
        }
        return { winnings: 0, message: "Game crashed, no winnings!", crashMultiplier: currentMultiplier };
    }

    const winnings = parseFloat((betValue * currentMultiplier).toFixed(2));
    delete gameStorage[gameId]; // End game after cash-out
    return { winnings, message: `You cashed out at ${currentMultiplier}!`, crashMultiplier: currentMultiplier };
};

// Helper function to generate a unique game ID (for example)
const generateGameId = () => {
    return 'game-' + Math.random().toString(36).substr(2, 9);
};

// Export the functions
module.exports = {
    startGame,
    stopGame,
    setNotifyCrashCallback, // Allow setting the WebSocket callback
};
