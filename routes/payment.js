const express = require('express')
const router = express.Router();
const qr = require('qrcode');

const pool = require('./../db')
conn = pool.getConnection();

router.get('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const data = await pool.query('SELECT * FROM payment WHERE student_id = ?', [studentId]);
        // const [data, fields] = await pool.execute('SELECT * FROM payment WHERE student_id = ?', [studentId]);
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

router.post('/', async (req, res) => {
    const { payment_name, desc, price, made_by, studentId } = req.body;
    try {
        conn = await pool.getConnection();
        const result = await conn.execute(
            'INSERT INTO payment (payment_name, desc, price, made_by, studentId) VALUES (?, ?, ?, ?, ?)',
            [payment_name, desc, price, made_by, studentId]
        );

        const payment_id = result.insertId;
        res.status(201).json({ message: 'Payment record created successfully', payment_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            conn.release();
        }
    }
})

router.get('/pay', async (req, res) => {
    // Get the payment ID from the request query or body
    const paymentId = req.query.paymentId || req.body.paymentId;

    if (!paymentId) {
        return res.status(400).json({ message: 'Payment ID is required' });
    }

    try {
        const [data, fields] = await pool.execute('SELECT * FROM payment WHERE Payment_id = ?', [paymentId]);
        if (data.length === 0) {
            res.status(404).json({ message: 'Payment not found'});
        } 

        const price = data[0].price;

        // Generate the QR code with the price information
        qr.toDataURL(price.toString(), (err, qrCodeData) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).json({ message: 'Failed to generate QR code' });
            }

            // Send the QR code data as a response
            res.status(200).json({ qrCodeData });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
