const jwt = require('jsonwebtoken'); // JWT library for token verification
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables, e.g., secret key for JWT

// This function will be used as middleware to protect certain routes
const authMiddleware = (req, res, next) => {
  // Check if authorization header is present
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data to the request object
    req.user = decoded;
    
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
