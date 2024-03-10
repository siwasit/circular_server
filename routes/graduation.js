const express = require('express')
const router = express.Router();

const pool = require('./../db')
conn = pool.getConnection();

router.get('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Calculate the GPA excluding F grades
        const [gpaRows] = await pool.execute(
            'SELECT SUM(CASE grade WHEN "A" THEN 4 WHEN "B" THEN 3 WHEN "C" THEN 2 WHEN "D" THEN 1 ELSE 0 END) / COUNT(*) AS gpa FROM transcript WHERE student_id = ? AND grade != "F"',
            [studentId]
        );
        const gpa = gpaRows[0].gpa;

        // Check if there are any F grades
        const [hasFRows] = await pool.execute(
            'SELECT COUNT(*) AS hasF FROM transcript WHERE student_id = ? AND grade = "F"',
            [studentId]
        );
        const hasF = hasFRows[0].hasF > 0;

        // Count the number of finished subjects
        const [subjectCountRows] = await pool.execute(
            'SELECT COUNT(*) AS subjectCount FROM transcript WHERE student_id = ?',
            [studentId]
        );
        const subjectCount = subjectCountRows[0].subjectCount;

        // Check if the student meets graduation requirements (no F grades, >= 40 subjects, and GPA >= 2.0)
        if (!hasF && subjectCount >= 40 && gpa >= 2.0) {
            res.json({ studentId, gpa, message: 'Student has graduated' });
        } else {
            res.json({ studentId, gpa, message: 'Student has not met graduation requirements' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;