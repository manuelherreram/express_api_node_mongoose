const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: 'title is required',
    maxlength: 300
  },
  text: {
    type: String,
    required: 'text is required',
    maxlength: 300
  },
  author: {
    type: String,
    required: true,
    maxlength: 300
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  }
});

const Post = mongoose.model('Post', schema);
module.exports = Post;
