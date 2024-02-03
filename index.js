const express = require('express')
const app = express()
const port = 3000

const personalRoute = require('./routes/personal');

app.use('/personal', personalRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})