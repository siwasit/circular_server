const express = require('express')
const app = express()
const port = 3000

const personalRoute = require('./routes/personal');
const educationRoute = require('./routes/education');
const authRoute = require('./routes/login');

app.use('/personal', personalRoute);
app.use('/education', educationRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})