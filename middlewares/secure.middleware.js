const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.auth = function (req, res, next) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SESSION_SECRET, function (err, decoded) {
      if (err) {
        next(createError(401, 'user is not authenticated'));
      } else {
        User.findById(decoded.sub)
          .then((user) => {
            if (user) {
              if (user.active) {
                req.user = user;
                next();
              } else {
                next(createError(401, 'The user has not validated the email.'));
              }
            } else {
              next(createError(401, 'user is not authenticated'));
            }
          })
          .catch(next);
      }
    });
  } else {
    next(createError(401, 'user is not authenticated'));
  }
};
