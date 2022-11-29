const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const createError = require('http-errors');

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => next(null, user))
    .catch(next);
});

passport.use(
  'local-auth',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, next) => {
      User.findOne({ email })
        .then((user) => {
          if (user) {
            return user.checkPassword(password).then((match) => {
              if (match) {
                if (user.active) {
                  next(null, user);
                } else {
                  next(createError(401, 'unauthorized: invalid user'));
                }
              } else {
                next(createError(401, 'Invalid email or password'));
              }
            });
          } else {
            next(createError(401, 'unauthorized'));
          }
        })
        .catch(next);
    },
  ),
);
