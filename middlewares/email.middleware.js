const nodemailer = require("nodemailer");

module.exports.sendMail = async function (mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const options = { from: process.env.EMAIL, ...mailOptions };
    transporter.sendMail(options, async function (error, info) {
      if (error) {
        resolve({ status: false, error });
      } else {
        resolve({ status: true, url: nodemailer.getTestMessageUrl(info) });
      }
    });
  });
};