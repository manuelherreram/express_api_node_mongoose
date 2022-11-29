const createError = require('http-errors');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.create = (req, res, next) => {
  const data = ({ name, email, password, bio } = req.body);

  User.create(data)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        user
          .checkPassword(password)
          .then((match) => {
            if (match) {
              const token = jwt.sign(
                {
                  sub: user.id,
                  exp: Date.now() / 1000 + 3600,
                },
                process.env.SESSION_SECRET,
              );
              res.json({ accessToken: token });
            } else {
              next(createError(404, 'User and password do not match'));
            }
          })
          .catch((err) => {
            next(createError(404, 'Password checking problem'));
          });
      } else {
        next(createError(404, 'User Not Found'));
      }
    })
    .catch((err) => {
      next(createError(404, 'User authentication problem'));
    });
};