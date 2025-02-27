const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Load user model
const User = require('../models/user');

// Local Login
module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  const userData = {
    email: email.trim().toLowerCase(),
    password: password.trim(),
  };

  // Find user by email
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      const error = new Error('Email not found.');
      error.name = 'IncorrectEmailError';

      return done(error);
    }

    // Compare hashed password to value in DB
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        const error = new Error('Incorrect password');
        error.name = 'IncorrectPasswordError';

        return done(error);
      }

      const payload = {
        sub: user._id,
        role: user.userRole,
      };

      // Create a token
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        userID: payload.sub,
        userRole: payload.role, 
      };

      return done(null, token, data);
    });
  });
});