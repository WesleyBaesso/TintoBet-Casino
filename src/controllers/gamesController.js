// gamesController.js

const blackjackController = require('./blackjackController');
const rouletteController = require('./rouletteController');
const slotsController = require('./slotsController');

const handleGameRequest = async (req, res) => {
    const { gameType } = req.params; // e.g., 'blackjack', 'roulette', 'slots'
    const { userId, bet } = req.body;

    try {
        let result;
        switch (gameType) {
            case 'blackjack':
                result = await blackjackController.playGame(userId, bet);
                break;
            case 'roulette':
                result = await rouletteController.playGame(userId, bet);
                break;
            case 'slots':
                result = await slotsController.playGame(userId, bet);
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
