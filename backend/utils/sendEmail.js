const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "misankigithub@gmail.com",
        pass: "ydnd kpqx qecb qtmm",
      },
    });

    const info = await transporter.sendMail({
      from: "your_email@gmail.com",
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;
