const createError = require('http-errors');
const User = require('../models/user.model');
const emailSender = require('../middlewares/email.middleware');
const crypto = require('../middlewares/crypto.middleware');
const url = require('url');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports.create = (req, res, next) => {
  const data = ({ name, email, bio, password } = req.body);
  User.create({
    ...data,
  })
    .then(async (user) => {
      const verificationToken = crypto.encrypt(user._id.toString());
      const hostname = req.headers.host;
      const pathname = url.parse(req.url).pathname;
      
      const host = `http://${hostname}/api/account/validate/${verificationToken}`;

      const emailResult = await emailSender.sendMail({
        to: user.email,
        subject: 'Verificación de Usuario',
        text: `Verifica tu correo en el siguiente link! ${host}`,
      });
      //console.log(emailResult);
      if (emailResult.status) {
        res.status(201).json({
          url: emailResult.url,
        });
      } else {
        next(createError(500, 'Error trying to send the email'));
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      next(createError(400, validations));
    } else {
      const token = jwt.sign({ sub: user.id, exp: Date.now() / 1000 + 3600 }, process.env.SESSION_SECRET);
      res.json({ token });
    }
  })(req, res, next);
};

module.exports.validate = (req, res, next) => {
  const id = crypto.decrypt(req.params.token);
  User.findByIdAndUpdate(
    { _id: id },
    { active: true },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.json({ message: `Your email ${user.email} has been validated` });
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch(next);
};
