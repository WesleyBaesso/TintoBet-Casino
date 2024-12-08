const blackjackController = require('./blackjackController');
const crashController = require('./crashController');
const slotsController = require('./slotsController');
const userModel = require('../models/userModel');

const handleGameRequest = async (req, res) => {
    const { betValue, gameType } = req.body; // Get betValue and gameType from the request body
    const user = res.locals.user; // Access the user and their balance from res.locals

    console.log('Received game request:', { betValue, gameType });
    console.log('Authenticated user:', user);

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
        console.log('Insufficient balance:', { userBalance: user.balance, betValue });
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    try {
        let result;
        console.log('Starting game logic for gameType:', gameType);

        switch (gameType) {
            case 'blackjack':
                console.log('Calling blackjackController.playGame');
                result = await blackjackController.playGame(user.username, betValue);
                break;

            case 'crash':
                console.log('Calling crashController.playGame');
                result = await crashController.playGame(user.username, betValue);
                break;

            case 'slots':
                console.log('Before deducting betValue:', { userBalance: user.balance });
                userModel.updateUserBalance(user.username, -betValue);
                user.balance -= betValue;
                console.log('After deducting betValue:', { userBalance: user.balance });

                console.log('Calling slotsController.playGame');
                result = await slotsController.playGame(user.username, betValue);
                if (result.winnings !== 0){
                    userModel.updateUserBalance(user.username, result.winnings);
                    user.balance += result.winnings;                        
                }
                break;

            default:
                console.error('Unexpected game type:', gameType);
                return res.status(400).json({ error: 'Invalid game type' });
        }

        console.log('Game result being sent to user:', result);
        res.json({ success: true, result });
    } catch (err) {
        console.error('Error handling game request:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = { handleGameRequest };
