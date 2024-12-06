const userModel = require('../models/userModel');

const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
      next(); // User is authenticated
  } else {
      res.redirect('/account.html'); 
  }
};

const attachUserBalanceToResponse = async (req, res, next) => {
  if (req.session && req.session.user) {
      try {
          // Fetch the user data (balance) from the database
          const balance = await userModel.getUserBalance(req.session.user.username);

          // Attach both the user and their balance to res.locals
          res.locals.user = {
              username: req.session.user.username,
              balance: balance
          };
      } catch (error) {
          console.error('Error fetching user balance:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  }
  next();  // Proceed to the next middleware or route
};

module.exports = {authenticateUser, attachUserBalanceToResponse};
