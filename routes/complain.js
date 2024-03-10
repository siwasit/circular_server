const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
    res.status(200).json({ message: 'No complaints available' });
});

router.post('/sendMail', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: to,
            subject: subject,
            text: text
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Email sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;