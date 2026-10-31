import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, text }) => {
  // If email configuration is missing, log message gracefully without crashing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email Service - Dev Mode]: Email to ${to} | Subject: "${subject}"`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Subh Lagan Sarees" <noreply@subhlagansarees.com>',
      to,
      subject,
      text: text || '',
      html: html || '',
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

export default sendEmail;

