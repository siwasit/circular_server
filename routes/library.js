const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const pool = require('./../db');
conn = pool.getConnection();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/book-list', async (req, res) => {

    try {
        const data = await pool.execute('SELECT * FROM book;');
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

router.post('/book-booking', async (req, res) => {
    const { student_id, book_id } = req.body;

    const currentDate = new Date();
    const returnDate = new Date(currentDate);
    returnDate.setDate(returnDate.getDate() + 7);

    const formattedReturnDate = returnDate.toISOString().split('T')[0];
    const book_status = 'sending';

    try {
        // Insert enrollment record into the database
        const result = await pool.query(
            'INSERT INTO book_booking (student_id, book_id, booking_date, status, return_date) VALUES (?, ?, CURDATE(), ?, ?)',
            [student_id, book_id, book_status, formattedReturnDate]
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

router.put('/update/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const { status } = req.body;
    try {
        conn = await pool.getConnection();
        const result = await conn.execute(
            'UPDATE book_booking SET status = ? WHERE book_id = ?',
            [status, bookId]
        );

        if (result.affectedRows === 0) { // affectedRows คือ property ของ result ที่ return มาจาก maria
            return res.status(404).json({ message: 'No student found with the specified Student_id.' });
        }
        res.json({ message: 'แก้ไขสำเร็จ' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
          conn.release();
        }
    }
})

router.get('/booking-list/:studentId', async (req, res) => {
    
    const studentId = req.params.studentId

    try {
        const data = await pool.query(`
        SELECT b.book_name, b.author, bb.booking_date, bb.return_date, bb.status
        FROM book_booking bb
        JOIN book b ON bb.book_id = b.Book_id
        WHERE bb.student_id = ?;
        `, [studentId]);

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

module.exports = router