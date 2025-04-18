import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // tu peux aussi utiliser Mailtrap ou autre service
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Axia Recrutement" <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    text,
  });
};
