const express = require('express')
const router = express.Router();
const pool = require('./../db')
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/vacentRoom' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const data = await connection.execute('SELECT * FROM room ');
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching vacant rooms:', error);
        res.status(500).json({ error: 'Failed to fetch vacant room' });
    }
});

router.post('/bookRoom', async (req, res) => {
    const { student_id, room_id, duration } = req.body;
    // console.log(req.body)
    try {
        const connection = await pool.getConnection();
        connection.execute('INSERT INTO room_booking (student_id, room_id, duration) VALUES (?, ?, ?)'
        , [student_id, room_id, duration]);
        res.status(200).json({ message: 'Booking room success' });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ error: 'Failed to book room' });
    }
});

router.get('/roomBooking/:studentId', async(req, res) => {
    const studentId = req.params.studentId
    try {
        const connection = await pool.getConnection();
        const data = await connection.execute(`
        SELECT rr.RBooking_id, rr.duration, r.name, r.location, s.eng_name
        FROM room_booking rr
        JOIN room r ON rr.room_id = r.Room_id
        JOIN student s On rr.student_id = s.Student_id
        WHERE rr.student_id = ?;
        `, [studentId]);
        if (data.length === 0) {
            res.status(404).json({ message: 'Not found'});
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('Error fetching room bookings:', error);
        res.status(500).json({ error: 'Failed to fetch room bookings' });
    }
});

router.delete('/cancelRoomBooking/:bookingId', async(req, res) => {
    const bookingId = req.params.bookingId;
    try {
        const connection = await pool.getConnection();
        // const [rows, fields] = await connection.execute('SELECT * FROM room_booking WHERE RBooking_id = ?', [bookingId]);
        // if (rows.length === 0) {
        //     return res.status(404).json({ error: 'Booking not found' });
        // }
        await connection.execute('DELETE FROM room_booking WHERE RBooking_id = ?', [bookingId]);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

module.exports = router;