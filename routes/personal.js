const express = require('express')
const router = express.Router();

const pool = require('./../db')
conn = pool.getConnection();

router.get('/request/:citizenId', async (req, res) => {
    const citizenId = req.params.citizenId;

    try {
        const [data, fields] = await pool.execute('SELECT * FROM student WHERE citizen_id = ?', [citizenId]);
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
    const { name, eng_name, faculty, branch, level, citizen_id, address, email, student_img, age, tel } = req.body;
    try {
        conn = await pool.getConnection();
        const result = await conn.execute(
            'INSERT INTO student (name, eng_name, faculty, branch, level, citizen_id, address, email, student_img, age, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, eng_name, faculty, branch, level, citizen_id, address, email, student_img || null, age, tel]
        );

        const studentId = result.insertId;
        res.status(201).json({ message: 'Student record created successfully', studentId });
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

router.get('/redirect', (req, res) => {
    // Assuming the other application is running on a different port (e.g., 3001)
    const otherAppUrl = 'https://www.example.com/';
  
    // Redirect the user to the other application's route
    res.redirect(otherAppUrl);
  });

module.exports = router;