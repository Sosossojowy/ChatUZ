const nodemailer = require('nodemailer');
require("dotenv").config();

// Konfiguracja transportera
const transporter = nodemailer.createTransport({
    host: "smtp.poczta.onet.pl",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Funkcja do wysyłania kodu
async function sendVerificationCode(email, code) {
  const mailOptions = {
    from: "chatuz@onet.pl",
    to: email,
    subject: "test",
    text: code
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Błąd przy wysyłaniu maila:', error);
    return false;
  }
}

module.exports = sendVerificationCode;