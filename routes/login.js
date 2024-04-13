const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../db')
const session = require('express-session');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

router.use(session({
    secret: 'Zbl5nHFobbasfWehqlklxed8GDR1Etdy', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
}));

conn = pool.getConnection();
// Login route
router.get('/', (req, res) => {
    res.render('index', { message: 'initial' , sessionid: 'initial'});
});

router.post('/login', async (req, res) => {
    const { citizenId } = req.body;
    const studentId = parseInt(req.body.studentId, 10); // Assuming base 10    
    // console.log(citizenId, studentId)
  
    try {
        const connection = await pool.getConnection();
        const data = await connection.query('SELECT Student_id, citizen_id FROM student WHERE Student_id = ? AND citizen_id = ?', [studentId, citizenId]);
        if (data.length === 1) {
            // Store user data in session
            req.session.user = data[0];
            res.setHeader('X-Session-ID', req.sessionID);
            res.render('index', { message: `Login successful your session id is ${req.sessionID}`, sessionid: req.sessionID });
        } else {
            res.render('index', { message: 'invalid username or password', sessionid: '' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.sendStatus(200);
    });
});

// // Middleware to protect routes
// const requireAuth = (req, res, next) => {
//   const { sessionId } = req.body;

//   // Check if session ID exists
//   if (sessions[sessionId]) {
//     // User authenticated, proceed to the next middleware
//     next();
//   } else {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// // Protected route example
// router.get('/protected', requireAuth, (req, res) => {
//   res.json({ message: 'Access granted to protected route' });
// });

// // Helper function to generate session ID
// function generateSessionId() {
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }

module.exports = router;
