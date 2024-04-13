const express = require('express')
const router = express.Router();
const pool = require('./../db')
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query('SELECT * FROM court');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error find court:', error);
        res.status(500).json({ error: 'Failed to find court' });
    }
});

router.post('/courtBooking', async (req, res) => {
    try {
        const { student_id, duration, courtID } = req.body; 
        const connection = await pool.getConnection();
        const query = 'INSERT INTO court_booking (student_id, duration, court_id) VALUES (?, ?, ?)';
        await connection.query(query, [student_id, duration, courtID]);
        connection.release();
        res.status(200).json({ message: 'Booking success' });
    } catch (error) {
        console.error('Error booking court:', error);
        res.status(500).json({ error: 'Failed to book court' });
    }
});

module.exports = router;