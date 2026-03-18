import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password",
    },
  });

  await transporter.sendMail({
    from: "your_email@gmail.com",
    to,
    subject,
    text,
  });
};

export default sendEmail;
