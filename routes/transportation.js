const express = require('express');
const router = express.Router();

const pool = require('./../db');
conn = pool.getConnection();

router.get('/getList', async (req, res) => {

    try {
        const [data, fields] = await pool.execute('SELECT * FROM bus WHERE status = "Available";');
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