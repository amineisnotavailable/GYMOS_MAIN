const nodemailer = require('nodemailer');
// In production, use real SMTP; for development we just log
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  ignoreTLS: true,
});

exports.sendParentNotification = async (parentContact, message) => {
  console.log(`[EMAIL] To: ${parentContact} - ${message}`);
  // Uncomment below to actually send email
  // await transporter.sendMail({ from: 'gym@example.com', to: parentContact, subject: 'Gym Notification', text: message });
};