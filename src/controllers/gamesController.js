const userModel = require('../models/userModel');
const blackjackController = require('./blackjackController');
const crashController = require('./crashController');
const slotsController = require('./slotsController');

const validateBetAndUser = (betValue, user) => {
    if (!user) throw new Error('User is not authenticated');
    if (!betValue || typeof betValue !== 'number' || betValue <= 0) throw new Error('Invalid bet value');
    if (betValue > user.balance) throw new Error('Insufficient balance');
};

const handleBlackjack = async (req, res) => {
    const { betValue } = req.body;
    const user = res.locals.user;

    try {
        validateBetAndUser(betValue, user);
        const result = await blackjackController.playGame(user, betValue);
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleSlots = async (req, res) => {
    const { betValue } = req.body;
    const user = res.locals.user;

    try {
        validateBetAndUser(betValue, user);
        userModel.updateUserBalance(user.username, -betValue);
        user.balance -= betValue;

        const result = await slotsController.playGame(betValue);
        if (result.winnings > 0) {
            userModel.updateUserBalance(user.username, result.winnings);
            user.balance += result.winnings;
        }
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const startCrashGame = async (req, res) => {
    const { betValue } = req.body;
    const user = res.locals.user;

    try {
        validateBetAndUser(betValue, user);
        userModel.updateUserBalance(user.username, -betValue);
        user.balance -= betValue;

        const result = await crashController.startGame(betValue, user);
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const stopCrashGame = async (req, res) => {
    const { gameId } = req.body;
    const user = res.locals.user;
    try {
        if (!gameId) throw new Error('Invalid game ID');
        const result = await crashController.stopGame(gameId, user);
        userModel.updateUserBalance(user.username, result.winnings);
        user.balance += result.winnings;
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    handleBlackjack,
    handleSlots,
    startCrashGame,
    stopCrashGame,
};
