const express = require('express');
const router = express.Router();

const pool = require('./../db');
conn = pool.getConnection();

router.get('/', async (req, res) => {

    try {
        const data = await pool.execute('SELECT * FROM bus;');
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