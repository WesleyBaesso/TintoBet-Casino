const auth = (req, res, next) => {
  if (req.session && req.session.user) {
      next(); // User is authenticated
  } else {
      res.redirect('/login.html'); 
  }
};

module.exports = auth;
