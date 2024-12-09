require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express app configuration
const http = require('http');
const WebSocket = require('ws'); // Import WebSocket module
const server = http.createServer(app); // Create an HTTP server using the Express app
const crashController = require('./src/controllers/crashController'); // Import the crash controller
const blackjackController = require('./src/controllers/blackjackController');

const wss = new WebSocket.Server({ noServer: true }); // Initialize WebSocket server

// Function to broadcast a message to all connected WebSocket clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Notify function for WebSocket
const notifyBlackjackState = (userId, gameState) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.userId === userId) {
            client.send(JSON.stringify({ type: 'blackjack_state', gameState }));
        }
    });
};

// Set the notify callback
blackjackController.setNotifyBlackjackCallback(notifyBlackjackState);

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Set up userId for the WebSocket connection (this needs to be set from the client or during authentication)
    ws.on('message', async (message) => {
        const { action, userId, gameId, betValue } = JSON.parse(message);
        
        // Set userId to the WebSocket connection (ensure this is done once on connection)
        if (userId) {
            ws.userId = userId; // Store userId in the WebSocket connection
        }

        try {
            let gameState;

            // Handle different actions
            if (action === 'start') {
                gameState = await blackjackController.playGame(userId, betValue);
            } else if (action === 'newCard') {
                gameState = await blackjackController.drawCard(userId, gameId);
            } else if (action === 'dealer_turn') {
                gameState = await blackjackController.dealerTurn(userId, gameId);
            } else {
                throw new Error('Invalid action');
            }

            // Send the updated game state to the client
            ws.send(JSON.stringify({ type: 'blackjack_state', gameState }));
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
    });

    // Register crash notification callback
    crashController.setNotifyCrashCallback((gameId, crashMultiplier) => {
        const message = {
            type: 'game_crash',
            gameId,
            crashMultiplier,
        };
        broadcast(message); // Notify all clients about the crash
    });
});

// Integrate WebSocket server with your existing HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request); // Emit connection event when WebSocket upgrade happens
    });
});

const PORT = process.env.PORT || 3000; // Get port from environment variables or default to 3000

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
