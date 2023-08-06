const mongoose = require('mongoose');
const express = require('express');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND } = require('./error_codes/errorCodes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,

}).then(() => {
  console.log('Соединение с ДБ установлено');
});

app.use(errors());

const regEx = (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(errors());
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страницы не существует' });
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
