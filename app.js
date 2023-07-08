const mongoose = require('mongoose');
const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const nocache = require('nocache');
const { NOT_FOUND } = require('./error_codes/errorCodes');

const { PORT = 3000 } = process.env;
const app = express();
app.use(nocache());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,

}).then(() => {
  console.log('Соединение с ДБ установлено')
});

app.use((req, res, next) => {
  req.user = {
    _id: '64a457a478a7f067d576035e'
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardRouter);
app.use('*', function (req, res) {
  res.status(NOT_FOUND).send({ message: 'Страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});


