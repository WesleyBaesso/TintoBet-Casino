require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express app configuration
const http = require('http');
const WebSocket = require('ws'); // Import WebSocket module
const server = http.createServer(app); // Create an HTTP server using the Express app
const crashController = require('./src/controllers/crashController'); // Import the crash controller

const wss = new WebSocket.Server({ noServer: true }); // Initialize WebSocket server

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    // Function to notify frontend about the crash event
    const notifyCrash = (gameId, crashMultiplier) => {
        const message = JSON.stringify({
            type: 'game_crash',
            gameId,
            crashMultiplier,
        });
        ws.send(message); // Send crash notification to the frontend
    };

    // Logic to stop the game if it crashes (this will now be handled by the controller)
    crashController.setNotifyCrashCallback(notifyCrash);
});

// Integrate WebSocket server with your existing HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const PORT = process.env.PORT || 3000; // Get port from environment variables or default to 3000

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
