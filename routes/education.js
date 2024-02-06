const express = require('express')
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');

const pool = require('./../db')
conn = pool.getConnection();

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service provider
        auth: {
        user: 'your-email@gmail.com', // your email address
        pass: 'your-email-password', // your email password
        },
    });
  
  // Read email template file
    const emailTemplate = fs.readFileSync('./../templete/email-template.html', 'utf8');
    
    // Define a function to send email with template
    const sendEmailWithTemplate = (template, variables) => {
        const renderedEmail = ejs.render(template, variables);
    
        const mailOptions = {
            from: 'your-email@gmail.com', // sender address
            to: 'engr@example.com', // list of receivers
            subject: 'Complaint Email', // Subject line
            html: renderedEmail, // HTML body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


router.get('/getList', async (req, res) => {

    try {
        const [data, fields] = await pool.execute('SELECT * FROM subject WHERE status = "Available";');
        if (data.length === 0) {
            res.status(404).json({ message: 'Not found'});
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/enroll', async (req, res) => {
    const { student_id, subject_id } = req.body;

    try {
        // Insert enrollment record into the database
        const result = await pool.query(
            'INSERT INTO enrollment (student_id, subject_id) VALUES (?, ?)',
            [student_id, subject_id]
        );

        // Check if enrollment was successful
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Student enrolled successfully' });
        } else {
            res.status(400).json({ message: 'Failed to enroll student' });
        }
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete', async (req, res) => {
    const { subjectId } = req.body;

    try {
        // Delete enrollment records for the given subject ID
        const result = await pool.query(
            'DELETE FROM enrollment WHERE subject_id = ?',
            [subjectId]
        );

        // Check if any enrollment records were deleted
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Enrollment subject deleted successfully' });
        } else {
            res.status(404).json({ message: 'No enrollment data found for the provided subject ID' });
        }
    } catch (error) {
        console.error('Error deleting enrollment data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/study-schedule/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
  
    try {
      // Query to retrieve subject data through enrollment table
      const query = `
        SELECT s.Subject_id, s.Subject_name, s.duration AS study_duration, s.study_room
        FROM enrollment e
        JOIN subject s ON e.subject_id = s.Subject_id
        WHERE e.student_id = ?;
      `;
      
      // Execute the query
      const [rows] = await db.query(query, [studentId]);
      
      // Send the retrieved subject data as response
      res.json(rows);
    } catch (error) {
      console.error('Error fetching study schedule:', error);
      res.status(500).json({ error: 'An error occurred while fetching study schedule' });
    }
});

router.get('/test-schedule/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
  
    try {
      // Query to retrieve subject data through enrollment table
      const query = `
        SELECT s.Subject_id, s.Subject_name, s.test_duration AS test_duration, s.study_room
        FROM enrollment e
        JOIN subject s ON e.subject_id = s.Subject_id
        WHERE e.student_id = ?;
      `;
      
      // Execute the query
      const [rows] = await db.query(query, [studentId]);
      
      // Send the retrieved subject data as response
      res.json(rows);
    } catch (error) {
      console.error('Error fetching test schedule:', error);
      res.status(500).json({ error: 'An error occurred while fetching test schedule' });
    }
});
  
router.post('/special-request', (req, res) => {
    const { name, studentId, faculty, branch, complaintContent } = req.body;

    // Get current date
    const currentDate = new Date().toDateString();
    
    // Send email with template and variables
    sendEmailWithTemplate(emailTemplate, { 
        complaintContent, 
        name,
        studentId,
        faculty,
        branch,
        currentDate 
    });
    
    res.send('Complaint Email sent successfully!');
});

router.get('/get-result/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const [data, fields] = await pool.execute('SELECT * FROM transcript WHERE studnet_id = ?;', [studentId]);
        if (data.length === 0) {
            res.status(404).json({ message: 'Not found'});
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;