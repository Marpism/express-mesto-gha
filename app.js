const mongoose = require('mongoose');
const express = require('express');
const process = require('process');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND } = require('./error_codes/errorCodes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,

}).then(() => {
  console.log('Соединение с ДБ установлено');
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64a457a478a7f067d576035e',
//   };
//   next();
// });

app.use(errors());

// app.post('/signin', login);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

// app.post('/signup', createUser);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

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
