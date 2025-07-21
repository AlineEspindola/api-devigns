const express = require('express');
const app = express();
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/chapter', require('./routes/api/chapter'));
app.use('/api/turn', require('./routes/api/turn'));
// app.use('/api/option', require('./routes/api/option'));

app.listen(port, () => {
  console.log('Servidor no ar')
})