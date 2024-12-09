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
        hasCrashed: false, // Track crash state
    };

    return {
        gameId,
        startTime,
        crashMultiplier,
    };
};

// Periodically monitor games for crashes
const monitorGames = () => {
    const now = Date.now();

    for (const [gameId, game] of Object.entries(gameStorage)) {
        const elapsedTime = (now - game.startTime) / 1000; // Time in seconds
        const currentMultiplier = parseFloat((elapsedTime * 0.1 + 1).toFixed(2));

        // Check if the game has crashed
        if (!game.hasCrashed && currentMultiplier >= game.crashMultiplier) {
            game.hasCrashed = true; // Mark game as crashed
            if (notifyCrash) {
                notifyCrash(gameId, game.crashMultiplier); // Notify frontend of the crash
            }
            delete gameStorage[gameId]; // Remove game from storage after notifying
        }
    }
};

// Stop the game if the user cashes out
const stopGame = async (gameId) => {
    const game = gameStorage[gameId];
    if (!game) throw new Error('Game not found');

    const { betValue, startTime } = game;
    const elapsedTime = (Date.now() - startTime) / 1000;
    const currentMultiplier = parseFloat((elapsedTime * 0.1 + 1).toFixed(2));

    // Prevent cash out if the game has already crashed
    if (game.hasCrashed) {
        throw new Error('Game has already crashed');
    }

    const winnings = parseFloat((betValue * currentMultiplier).toFixed(2));
    delete gameStorage[gameId]; // End game after cash-out
    return { winnings, message: `You cashed out at ${currentMultiplier}!`, crashMultiplier: currentMultiplier };
};

// Helper function to generate a unique game ID (for example)
const generateGameId = () => {
    return 'game-' + Math.random().toString(36).substr(2, 9);
};

// Start monitoring games periodically
setInterval(monitorGames, 100); // Check for crashes every 100ms

// Export the functions
module.exports = {
    startGame,
    stopGame,
    setNotifyCrashCallback, // Allow setting the WebSocket callback
};
