const express = require('express');
const gamesController = require('../../controllers/gamesController');
const router = express.Router();

router.post('/blackjack', gamesController.handleBlackjack);
router.post('/slots', gamesController.handleSlots);
router.post('/crash/start', gamesController.startCrashGame);
router.post('/crash/stop', gamesController.stopCrashGame);

module.exports = router;
