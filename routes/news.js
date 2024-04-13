const express = require('express')
const router = express.Router();
const pool = require('../db')

router.get('/' , async(req , res) => {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query('SELECT * FROM news');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error: Failed to fetch news data:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }    
});

module.exports = router;