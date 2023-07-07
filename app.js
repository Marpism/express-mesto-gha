const mongoose = require('mongoose');
const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const nocache = require('nocache');

const { PORT = 3000 } = process.env;
const app = express();
app.use(nocache());
// app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false, не работает

}).then(() => {
  console.log('Соединение с ДБ установлено') });

app.use((req, res, next) => {
  req.user = {
    _id: '64a457a478a7f067d576035e'
  };
  next();
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use('/', usersRouter);
app.use('/', cardRouter);

// app.get('*', function(req, res){
//   res.status(404).send('what???');
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});


