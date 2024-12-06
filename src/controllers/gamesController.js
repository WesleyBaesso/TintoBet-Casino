const blackjackController = require('./blackjackController');
const crashController = require('./crashController');
const slotsController = require('./slotsController');

const handleGameRequest = async (req, res) => {
    const { betValue, gameType } = req.body; // Get betValue and gameType from the request body
    const userId = req.session.userId; // Get userId from the session

    if (!userId) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!betValue || typeof betValue !== 'number' || betValue <= 0) {
        return res.status(400).json({ error: 'Invalid bet value' });
    }

    if (!gameType || !['blackjack', 'crash', 'slot-machine'].includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
    }

    try {
        let result;
        switch (gameType) {
            case 'blackjack':
                result = await blackjackController.playGame(userId, betValue);
                break;
            case 'crash':
                result = await crashController.playGame(userId, betValue);
                break;
            case 'slots':
                result = await slotsController.playGame(userId, betValue);
                break;
            default:
                return res.status(400).json({ error: 'Invalid game type' });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = { handleGameRequest };
