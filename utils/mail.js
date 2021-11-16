const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const logger = require("./logger");

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};
const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = async (params) => {
  var mailOptions = {
    from: process.env.FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    text: params.text,
    link: params.link,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      logger.err("Error Occurs", err);
    } else {
      logger.info("Email sent successfully");
    }
  });
};

module.exports = { sendMail };
