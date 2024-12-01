const express = require('express');
const auth = require('../middlewares/auth');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/blackjack', auth, gamesController.blackjack);
router.get('/roulette', auth, gamesController.roulette);
router.get('/slot-machine', auth, gamesController.slotMachine);

module.exports = router;
