const blackjackController = require('./blackjackController');
const crashController = require('./crashController');
const slotsController = require('./slotsController');

const handleGameRequest = async (req, res) => {
    const { betValue, gameType } = req.body; // Get betValue and gameType from the request body
    const user = res.locals.user; // Access the user and their balance from res.locals

    if (!user) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!betValue || typeof betValue !== 'number' || betValue <= 0) {
        return res.status(400).json({ error: 'Invalid bet value' });
    }

    if (!gameType || !['blackjack', 'crash', 'slots'].includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
    }

    // Check if betValue exceeds user's balance
    if (betValue > user.balance) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    try {
        let result;
        switch (gameType) {
            case 'blackjack':
                result = await blackjackController.playGame(user.username, betValue);
                break;
            case 'crash':
                result = await crashController.playGame(user.username, betValue);
                break;
            case 'slots':
                result = await slotsController.playGame(user.username, betValue);
                break;
            default:
                return res.status(400).json({ error: 'Invalid game type' });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error('Error handling game request:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
};


module.exports = { handleGameRequest };
