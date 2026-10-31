const nodemailer = require('nodemailer');

async function sendEmail({ email, subject, message }) {
    const settings = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    };
    const mailClient = nodemailer.createTransport(settings);
    const sender = process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL;

    return mailClient.sendMail({
        from: `${process.env.SMTP_FROM_NAME || 'ShopKart'} <${sender}>`,
        to: email,
        subject,
        text: message
    });
}

module.exports = sendEmail;
