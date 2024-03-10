const express = require('express')
const app = express()
const port = 3000

const personalRoute = require('./routes/personal');
const educationRoute = require('./routes/education');
const authRoute = require('./routes/login');
const dormRoute = require('./routes/dormitory');
const roomBookingRoute = require('./routes/roomBooking');
const bookBookingRoute = require('./routes/library');
const transportationRoute = require('./routes/transportation')
const healthRoute = require('./routes/้health')
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})