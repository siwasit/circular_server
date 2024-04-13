const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('./../db');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

// สร้าง Router สำหรับ GET ข้อมูลการร้องเรียน
router.get('/get-complains', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM complain');
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
  
  // สร้าง Router สำหรับ POST การร้องเรียน
router.post('/add-complains', async (req, res) => {
    const { studentId, subject, description } = req.body;
    try {
        const result = await pool.query('INSERT INTO complain (studentId, subject, description) VALUES (?, ?, ?)', [studentId, subject, description]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'complain send successfully' });
        } else {
            res.status(400).json({ message: 'Failed to send complain' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;