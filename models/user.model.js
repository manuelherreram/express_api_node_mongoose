const mongoose = require('mongoose');
require('mongoose-type-email');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const PASSWORD_PATTERN = /^.{8,}$/;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
    },
    password: {
      type: String,
      required: 'A valid password is required',
      match: [PASSWORD_PATTERN, 'the password is invalid'],
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

schema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

schema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model('User', schema);
module.exports = User;
