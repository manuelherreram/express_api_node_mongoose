const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports.sendValidationEmail = (user) => {
  transporter
    .sendMail({
      from: `"API Post System" <${email}>`,
      to: user.email,
      subject: 'Welcome to Post System', // Subject line
      html: `
        <h1>Welcome to Post System</h1>
        <h2>by CyberIngeniero</h2>
        <p>Activate your account</p>
        <a href="${process.env.APP_HOST}/api/users/${user.id}/activate">Click here</a>
        `,
    })
    .then(() => {
      console.log(`email sent to ${user.id}`);
    })
    .catch((err) => {
      console.error('error sending mail', err);
    });
};