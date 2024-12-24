const nodemailer = require('nodemailer');

// Zoho Mail Transporter Tanımlama
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com', // Zoho Mail SMTP host
  port: 465, // Zoho Mail için SSL portu
  secure: true, // SSL kullanımı için true
  auth: {
    user: process.env.EMAIL_USER, // Zoho Mail kullanıcı adı (e-posta adresi)
    pass: process.env.EMAIL_PASS, // Zoho Mail şifresi veya uygulama şifresi
  },
});

// E-posta Gönderim Fonksiyonu
const sendDiscountEmail = async (to) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Gönderen e-posta adresi
    to, // Alıcı e-posta adresi
    subject: '50% Discount Just for You!',
    text: 'Thank you for signing in! Here is your 50% discount code: DISCOUNT50',
    html: '<h1>Thank you for signing in!</h1><p>Here is your 50% discount code: <strong>DISCOUNT50</strong></p>',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = { sendDiscountEmail };
