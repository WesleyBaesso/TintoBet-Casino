const blackjackController = require('./blackjackController');
const crashController = require('./crashController');
const slotsController = require('./slotsController');

const handleGameRequest = async (req, res) => {
    const { gameType } = req.params; 
    const { userId, bet } = req.body;

    try {
        let result;
        switch (gameType) {
            case 'blackjack':
                result = await blackjackController.playGame(userId, bet);
                break;
            case 'roulette':
                result = await crashController.playGame(userId, bet);
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
