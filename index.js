const express = require('express')
const app = express()
const port = 3000

const personalRoute = require('./routes/personal');
const educationRoute = require('./routes/education');
const authRoute = require('./routes/login');
const dormRoute = require('./routes/dormitory');
const roomBookingRoute = require('./routes/roomBooking');

app.use('/personal', personalRoute);
app.use('/education', educationRoute);
app.use('/auth', authRoute);
app.use('/dorm', dormRoute);
app.use('/room-booking', roomBookingRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})