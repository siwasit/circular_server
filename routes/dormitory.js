const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('./../db');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/vacantRoom', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const vacantRooms = await connection.query('SELECT * FROM dorm_room WHERE status = "Available"');
      res.json(vacantRooms);
    } catch (error) {
      console.error('Error fetching vacant rooms:', error);
      res.status(500).send('Error fetching vacant rooms');
    }
});

router.post('/bookRoom', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { student_id, room_id } = req.body; 
        await connection.execute('INSERT INTO dorm_booking (student_id, droom_id) VALUES (?, ?)', [student_id, room_id]);
        res.status(200).json({ message: 'Booking room success' });
    } catch (error) {
        console.error('Error booking room:', error);
        res.status(500).send('Error booking room');
    }
});

router.delete('/cancelDormBooking/:booking_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const bookingId = req.params.booking_id; 
        await connection.execute('DELETE FROM dorm_booking WHERE Dbooking_id = ?', [bookingId]);
        res.status(200).json({ message: 'Room booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling room booking:', error);
        res.status(500).send('Error canceling room booking');
    }
});

router.post('/selectDormService', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { title, details, room_id, service_type } = req.body; 
        await connection.query('INSERT INTO dorm_service (title, detail, room_id, service_type) VALUES (?, ?, ?, ?)', [title, details, room_id, service_type]);
        res.status(200).json({ message: 'success!!!' });
    } catch (error) {
        console.error('Error assigning dormitory service:', error);
        res.status(500).send('Error assigning dormitory service');
    }
});

router.delete('/cancelDormService/:service_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const serviceId = req.params.service_id;
        await connection.execute('DELETE FROM dorm_service WHERE service_id = ?', [serviceId]);
        res.status(200).json({ message: 'Dormitory service deleted successfully' });
    } catch (error) {
        console.error('Error deleting dormitory service:', error);
        res.status(500).send('Error deleting dormitory service');
    }
});

module.exports = router;