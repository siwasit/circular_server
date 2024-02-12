const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

const path = require('path');
const templatePath = path.join(__dirname, '..', 'template', 'email-template.html');
const emailTemplate = fs.readFileSync(templatePath, 'utf8');

const sendEmailWithTemplate = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

router.get('/AlertEmergency', async (req, res) => {
    const { name, studentId, faculty, address } = req.query;
    const currentDate = new Date().toDateString();
    try {
        const renderedEmail = ejs.render(emailTemplate, { currentDate, name, studentId, faculty, address });
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'engr@example.com',
            subject: 'Emergency Email',
            html: renderedEmail,
        };
        sendEmailWithTemplate(mailOptions);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

router.get('/AppointmentData', async (req, res) => {
    const { name, studentId, faculty, appointmentdata } = req.query; 
    const currentDate = new Date().toDateString();
    try {
        const renderedEmail = ejs.render(emailTemplate, { currentDate, name, studentId, faculty, appointmentdata });
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'engr@example.com',
            subject: 'Appointment Email',
            html: renderedEmail,
        };
        sendEmailWithTemplate(mailOptions);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }

});

module.exports = router;