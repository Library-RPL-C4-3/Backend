const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // atau smtp provider lainnya
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, htmlContent) {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "(terisi)" : "(KOSONG)");
  const mailOptions = {
    from: `"Perpustakaan" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);

}

module.exports = { sendEmail };
