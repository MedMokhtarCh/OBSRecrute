import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendNotificationEmail = async ({
  to,
  subject,
  jobDetails,
  candidateName,
  status,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Axia Recruitment" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <p>Hello ${candidateName},</p>
        <p>We have an update regarding your job application.</p>
          <h3> Your Application is:</h3>
        <p><strong>${status}</strong></p>

        <h3>Job Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${jobDetails.title}</li>
          <li><strong>Location:</strong> ${
            jobDetails.location || "Not specified"
          }</li>
          <li><strong>Salary:</strong> ${
            jobDetails.salary || "Not specified"
          }</li>
          <li><strong>Type:</strong> ${
            jobDetails.jobType || "Not provided"
          }</li>
           <li><strong>Description:</strong> ${
             jobDetails.responsabilities || "Not provided"
           }</li>
        </ul>
        <p>Thank you for your interest.</p>
        <p>Best regards,<br>The Axia Recruitment Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
