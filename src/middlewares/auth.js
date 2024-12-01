const auth = (req, res, next) => {
  if (req.session && req.session.user) {
      next(); // User is authenticated
  } else {
      res.redirect('/login.html'); // Redirect to login
  }
};

module.exports = auth;
