const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

const pool = require('./../db')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
conn = pool.getConnection();

router.get('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    console.log(studentId)

    try {
        const [data, fields] = await pool.execute('SELECT * FROM student WHERE Student_id = ?', [studentId]);
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
    console.log(req.body)
    const { name, eng_name, faculty, branch, level, citizen_id, address, email, student_img, age, tel } = req.body;
    try {
        conn = await pool.getConnection();
        const result = await conn.execute(
            'INSERT INTO student (name, eng_name, faculty, branch, level, citizen_id, address, email, student_img, age, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, eng_name, faculty, branch, level, citizen_id, address, email, student_img || null, age, tel]
        );

        res.status(201).json({ message: 'Student record created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            conn.release();
        }
    }
})

router.put('/update/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const { name, eng_name, faculty, branch, level, citizen_id, address, email, student_img, age, tel } = req.body;
    try {
        conn = await pool.getConnection();
        const result = await conn.execute(
            'UPDATE student SET name = ?, eng_name = ?, faculty = ?, branch = ?, level = ?, citizen_id = ?, address = ?, email = ?, student_img = ?, age = ?, tel = ? WHERE Student_id = ?',
            [name, eng_name, faculty, branch, level, citizen_id, address, email, student_img || null, age, tel, studentId]
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

router.get('/bank/redirect', (req, res) => {
    // Assuming the other application is running on a different port (e.g., 3001)
    const otherAppUrl = 'https://www.example.com/';
  
    // Redirect the user to the other application's route
    res.redirect(otherAppUrl);
  });

module.exports = router;