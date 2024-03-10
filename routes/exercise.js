const express = require('express')
const router = express.Router();
const pool = require('./../db')

router.get('/' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM court');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error find court:', error);
        res.status(500).json({ error: 'Failed to find court' });
    }
});

router.post('/courtBooking', async (req, res) => {
    try {
        const { student_id, duration, courtID } = req.body; 
        const connection = await pool.getConnection();
        const query = 'INSERT INTO court_booking (student_id, duration, courtID) VALUES (?, ?, ?)';
        await connection.query(query, [student_id, duration, courtID]);
        connection.release();
        res.status(200).json({ message: 'Booking success' });
    } catch (error) {
        console.error('Error booking court:', error);
        res.status(500).json({ error: 'Failed to book court' });
    }
});

module.exports = router;