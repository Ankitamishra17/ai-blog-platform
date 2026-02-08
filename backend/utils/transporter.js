const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "ankitamishra8763@gmail.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

module.exports = transporter