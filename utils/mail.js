const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

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
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = { sendMail };
