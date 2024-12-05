const express = require('express');
const gamesController = require('../../controllers/gamesController');
const router = express.Router();

router.post('/handle-game-request', gamesController.handleGameRequest)

module.exports = router;