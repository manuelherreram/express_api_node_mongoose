const createError = require('http-errors');
const Post = require('../models/post.model');

module.exports.auth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(createError(401, 'user is not authenticated'));
  }
};

module.exports.self = function (req, res, next) {
  if (req.params.id == req.user.id) {
    next();
  } else {
    next(createError(403, 'forbidden'));
  }
};

module.exports.postOwner = function (req, res, next) {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        next(createError(404, 'post not found'));
      }
    })
    .catch(next);
};
