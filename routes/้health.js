const express = require('express');
const router = express.Router();
const pool = require('./../db')
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

// สร้าง Router สำหรับ GET ข้อมูลการนัดหมาย
router.get('/get-appointments', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM appointments');
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
  
   // สร้าง Router สำหรับ POST การนัดหมาย
router.post('/add-appointments', async (req, res) => {
    const { studentId, appointmentDate, subject } = req.body;
    try {
        const result = await pool.query('INSERT INTO appointments (studentId, appointmentDate, subject) VALUES (?, ?, ?)', [studentId, appointmentDate, subject]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'appointment send successfully' });
        } else {
            res.status(400).json({ message: 'Failed to send appointment' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
  // สร้าง Router สำหรับ PUT อัปเดตสถานะการนัดหมาย
router.put('/update-appointments', async (req, res) => {
    const { appoint_id, aptStatus } = req.body;
    console.log(appoint_id, aptStatus);
    try {
        conn = await pool.getConnection();
        const result = await conn.execute('UPDATE appointments SET status = ? WHERE appoint_id = ?', [aptStatus, appoint_id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Appointment status set successfully' });
        } else {
            console.log(result)
            res.status(400).json({ message: 'Failed to set appointment status' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;