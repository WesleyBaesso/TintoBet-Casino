require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express app configuration
const http = require('http');
const server = http.createServer(app); // Create an HTTP server using the Express app
const PORT = process.env.PORT || 3000; // Get port from environment variables or default to 3000

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
