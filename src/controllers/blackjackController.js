let blackjackGames = {}; // Store active game states
let notifyBlackjackState = null; // Callback to notify WebSocket clients about game state updates

// Set the callback function to notify WebSocket about the game state updates
const setNotifyBlackjackCallback = (callback) => {
    notifyBlackjackState = callback;
};

// Helper functions
const getRandomCard = () => {
    const card = Math.floor(Math.random() * 13) + 1;
    return card > 10 ? 10 : card === 1 ? 11 : card;
};

const calculateSum = (cards) => {
    let sum = cards.reduce((a, b) => a + b, 0);
    while (sum > 21 && cards.includes(11)) {
        cards[cards.indexOf(11)] = 1; // Convert an ace from 11 to 1
        sum = calculateSum(cards);
    }
    return sum;
};

// Start a new game
const playGame = async (userId, betValue) => {
    
    if (!betValue || betValue <= 0) {
        throw new Error('Invalid bet value');
    }

    const gameId = generateGameId();
    const playerCards = [getRandomCard(), getRandomCard()];
    const dealerCards = [getRandomCard()];
    const playerSum = calculateSum(playerCards);
    const dealerSum = calculateSum(dealerCards);

    blackjackGames[gameId] = {
        userId,
        gameId,
        betValue,
        playerCards,
        dealerCards,
        playerSum,
        dealerSum,
        isPlayerAlive: true,
        isGameOver: false,
        message: playerSum === 21 ? 'Blackjack! You win!' : 'Your turn!',
    };

    if (notifyBlackjackState) {
        notifyBlackjackState(userId, blackjackGames[gameId]);
    }

    return blackjackGames[gameId];
};

// Player draws a card
const drawCard = async (userId, gameId) => {
    const game = blackjackGames[gameId];
    if (!game || game.userId !== userId) {
        throw new Error('Game not found or access denied');
    }

    if (!game.isPlayerAlive) {
        throw new Error('Game is already over');
    }

    game.playerCards.push(getRandomCard());
    game.playerSum = calculateSum(game.playerCards);

    if (game.playerSum > 21) {
        game.isPlayerAlive = false;
        game.isGameOver = true;
        game.message = 'You busted!';
    } else {
        game.message = 'Your turn!';
    }

    if (notifyBlackjackState) {
        notifyBlackjackState(userId, game);
    }

    return game;
};

// Dealer's turn
const dealerTurn = async (userId, gameId) => {
    const game = blackjackGames[gameId];
    if (!game || game.userId !== userId) {
        throw new Error('Game not found or access denied');
    }

    if (game.isGameOver) {
        throw new Error('Game is already over');
    }

    // Dealer draws cards until sum is at least 17
    while (game.dealerSum < 17) {
        game.dealerCards.push(getRandomCard());
        game.dealerSum = calculateSum(game.dealerCards);
    }

    // Determine the outcome
    if (game.dealerSum > 21 || game.playerSum > game.dealerSum) {
        game.message = 'You win!';
    } else if (game.playerSum === game.dealerSum) {
        game.message = "It's a tie!";
    } else {
        game.message = 'Dealer wins!';
    }

    game.isGameOver = true;

    if (notifyBlackjackState) {
        notifyBlackjackState(userId, game);
    }

    return game;
};

// Generate a unique game ID
const generateGameId = () => {
    return 'game-' + Math.random().toString(36).substr(2, 9);
};

// Export functions
module.exports = {
    playGame,
    drawCard,
    dealerTurn,
    setNotifyBlackjackCallback,
};
