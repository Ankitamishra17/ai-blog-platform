const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔥 important for Render
      auth: {
        user: process.env.EMAIL, // ✅ FIXED
        pass: process.env.EMAIL_PASS, // ✅ FIXED
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL, // ✅ FIXED
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
