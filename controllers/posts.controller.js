const createError = require('http-errors');
const Post = require('../models/post.model');

module.exports.create = (req, res, next) => {
  const data = ({ title, text, author } = req.body);

  Post.create(data)
    .then((post) => res.status(201).json(post))
    .catch(next);
};

module.exports.list = (req, res, next) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch(next);
};

module.exports.detail = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        next(createError(404, 'post not found'));
      }
    })
    .catch(next);
};

module.exports.update = (req, res, next) => {
  const { id } = req.params;
  const data = ({ title, text, author } = req.body);

  Post.findByIdAndUpdate(id, data, { new: true })
    .then(post => post ? res.json(post) : next(createError(404, 'Post Not Found')))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
      .then(() => res.status(204).send())
      .catch(next);
}
