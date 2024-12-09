require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express app configuration
const http = require('http');
const WebSocket = require('ws'); // Import WebSocket module
const server = http.createServer(app); // Create an HTTP server using the Express app
const crashController = require('./src/controllers/crashController'); // Import the crash controller

const wss = new WebSocket.Server({ noServer: true }); // Initialize WebSocket server

// Function to broadcast a message to all connected WebSocket clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('Received:', message);
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
        wss.emit('connection', ws, request);
    });
});

const PORT = process.env.PORT || 3000; // Get port from environment variables or default to 3000

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 