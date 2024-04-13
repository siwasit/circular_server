const express = require('express')
const router = express.Router();
const pool = require('./../db')
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
router.get('/vacentRoom' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM room');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching vacant rooms:', error);
        res.status(500).json({ error: 'Failed to fetch vacant rooms' });
    }
});

router.post('/bookRoom', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('INSERT INTO room_booking (student_id, room_id, duration) VALUES (?, ?, ?)'
        , [student_id, room_id, duration]);
        res.status(200).json({ message: 'Booking room success' });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ error: 'Failed to book room' });
    }
});
router.get('/roomBooking', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM room_booking');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching room bookings:', error);
        res.status(500).json({ error: 'Failed to fetch room bookings' });
    }
});


module.exports = router;
