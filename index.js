const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express()

const port = 3000

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:8081",
  })
);
 

const personalRoute = require('./routes/personal');
const educationRoute = require('./routes/education');
const authRoute = require('./routes/login');
const dormRoute = require('./routes/dormitory');
const roomBookingRoute = require('./routes/roomBooking');
const bookBookingRoute = require('./routes/library');
const transportationRoute = require('./routes/transportation')
const healthRoute = require('./routes/health')
const payRoute = require('./routes/payment')
const scholarshipEnrollRoute = require('./routes/scholarship')
const doneEnrollRoute = require('./routes/graduation')
const newsRoute = require('./routes/news')
const exerciseRoute = require('./routes/exercise')
const entertainmentRoute = require('./routes/entertainment')
const complainRoute = require('./routes/complain')

app.use('/personal', personalRoute);
app.use('/education', educationRoute);
app.use('/auth', authRoute);
app.use('/dorm', dormRoute);
app.use('/room-booking', roomBookingRoute);
app.use('/book-booking', bookBookingRoute);
app.use('/bus-check', transportationRoute);
app.use('/health', healthRoute);
app.use('/payment', payRoute);
app.use('/scholarship', scholarshipEnrollRoute);
app.use('/news', newsRoute);
app.use('/exercise', exerciseRoute);
app.use('/entertainment', entertainmentRoute);
app.use('/complain', complainRoute);
app.use('/endyourlife', doneEnrollRoute);

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for the views (optional if the views directory is named 'views')
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'Zbl5nHFobbasfWehqlklxed8GDR1Etdy', // Change this to a random string
  resave: false,
  saveUninitialized: true
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const jsonData = { message: 'Hello World!' };
  res.json(jsonData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})