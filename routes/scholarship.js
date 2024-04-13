const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

const pool = require('./../db')
conn = pool.getConnection();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    try {
        const data = await pool.execute('SELECT * FROM scholarship');
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

router.post('/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Extract scholarship data from the request body
        const { scholarship_id } = req.body;

        // Validate required fields
        if (!scholarship_id) {
            return res.status(400).json({ message: 'Scholarship id is required' });
        }

        // Insert scholarship data into the scholarship table
        const result = await pool.execute(
            'INSERT INTO scholarship_enroll (student_id, scholarship_id, status) VALUES (?, ?, ?)',
            [studentId, scholarship_id, 'Waiting']
        );

        // Extract inserted scholarship ID

        // Check if insertion was successful
        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Scholarship registered successfully' });
        } else {
            res.status(500).json({ message: 'Failed to register scholarship' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/status/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const [data, fields] = await pool.execute('SELECT * FROM scholarship_enroll WHERE student_id = ?', [studentId]);
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

router.put('/update_status/:enroll_id', async (req, res) => {
    const enroll_id = req.params.enroll_id;
    const status = req.params.status;

    try {
        // Update the status of the scholarship enrollment
        const [result] = await pool.execute(
            'UPDATE scholarship_enroll SET status = ? WHERE enroll_id = ?',
            [status, enroll_id]
        );

        if (result.affectedRows === 1) {
            res.json({ message: 'Scholarship enrollment status updated successfully' });
        } else {
            res.status(404).json({ message: 'Scholarship enrollment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;
