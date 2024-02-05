const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const authRouter = express.Router();
const pool = require('./../db')

authRouter.use(session({
    secret: 'jNRRja=gcz=$f^QIXCBj9w&xn}#n7S', //คีย์ที่ใช้ในการเข้ารหัสข้อมูล session เพื่อความปลอดภัย
    resave: false, //กำหนดว่า session ควรจะถูกบันทึกลงในฐานข้อมูลทุกครั้งที่มีการเปลี่ยนแปลง
    saveUninitialized: true, //กำหนดว่า session ควรถูกบันทึกถ้า session ไม่มีการเปลี่ยนแปลง
    cookie: { secure: false } // ตั้งค่าเกี่ยวกับ cookie ที่ใช้ในการเก็บ session ID ใช้กับ https เท่านั้น
}));


authRouter.use(cookieParser());
authRouter.use(passport.initialize()); //ข้อมูลผู้ใช้ที่ได้จากการตรวจสอบตัวตน
authRouter.use(passport.session());


passport.use(new LocalStrategy(
    async (username, password, done) => {

        //ดึงข้อมูล username และ password จาก request body ที่ส่งมา
        //await ช่วยให้โค้ดทำงานได้อย่างเป็นลำดับ และไม่ต้องใช้ callback functions เพื่อจัดการกับ asynchronous operations 
        //ใช้ pool เพื่อขอ connection จาก pool และ await จนกว่า connection จะถูกสร้างขึ้น
    const connection = await pool.getConnection();
        try {
            const result = await connection.query(
                'SELECT id, username, password FROM users WHERE username = ?',
                [username]
            );

            if (result.length === 0) {
                return done(null, false, { 
                    message: 'User not found' 
                });
            }

            const user = result[0];

            // Check password
            if (password === user.password) {
                return done(null, user);
            } else {
                return done(null, false, { 
                    message: 'Wrong password' 
                });
            }
        } catch (error) {
            console.error(error);
            return done(error);
        } finally {
            connection.release();
        }
    }
));

// Passport ใช้เพื่อเก็บข้อมูลของผู้ใช้ใน session จากการตรวจสอบตัวตน
passport.serializeUser((user, done) => {
    done(null, user.id); //เก็บค่า session ด้วย id เรียกด้วย callback function
});

//  Passport ใช้เพื่อดึงข้อมูลผู้ใช้จาก session
passport.deserializeUser(async (id, done) => { //session ID ที่ถูกเก็บไว้ใน cookie
    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'SELECT id, username FROM users WHERE id = ?',
            [id]
        );

        if (result.length === 0) {
            return done(null, false); //ไม่พบข้อมูลผู้ใช้ / ไม่พบข้อมูลผู้ใช้ที่มี session ID นี้ในฐานข้อมูล
            //done จะถูกเรียกด้วย null เพื่อบอก Passport ว่าไม่มีข้อผิดพลาดเกิดขึ้นในขั้นตอนนี้
            //และข้อมูลผู้ใช้ที่ได้จากการ query จะถูกส่งกลับไปยัง Passport เพื่อให้ Passport ใช้ใน request ต่อไป
        }

        const user = result[0];
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error);
    } finally {
        connection.release();
    }
});

authRouter.post('/login', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = authRouter;