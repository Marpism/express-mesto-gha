const bcrypt = require('bcryptjs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const BadReqError = require('../errors/BadReqError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthError = require('../errors/UnauthError');

const {
  CREATED, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR,
} = require('../error_codes/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id, { lean: false }, { runValidators: true })
    .orFail(() => {
      const err = new Error();
      err.status = NOT_FOUND;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          // err: err.message
        });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
        });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
// НАПИСАТЬ
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, hash }))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({
            message: 'переданы некорректные данные',
            err: err.name,
          });
        } else {
          res.status(INTERNAL_SERVER_ERROR).send({
            message: 'Что-то не так',
            // err: err.message
          });
        }
      })
};
  // User.create({ name, about, avatar, email, password })
    // .then((user) => res.status(CREATED).send({ data: user }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST).send({
    //       message: 'переданы некорректные данные',
    //       err: err.name,
    //     });
    //   } else {
    //     res.status(INTERNAL_SERVER_ERROR).send({
    //       message: 'Что-то не так',
    //       // err: err.message
    //     });
    //   }
    // });


module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(userId, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    .orFail(() => {
      const err = new Error();
      err.status = NOT_FOUND;
      throw err;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          // err: err.message
        });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
          // err: err.message
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const err = new Error();
      err.status = NOT_FOUND;
      throw err;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          // err: err.message
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
          // err: err.message
        });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }) // добавить метод в модель?
  .orFail(() => {
    const err = new Error();
    err.status = NOT_FOUND;
    throw err;
  })
  .then((user) => {
    return bcrypt.compare(password, user.password);
  })
  .then((matched) => {
    if (!matched) {
      return Promise.reject(new Error('Неправильные почта или пароль'))
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token, message: 'Добро пожаловать!' });
  })
  .catch((err) => { // обработка ошибки не по тз
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'переданы некорректные данные',
        // err: err.message
      });
    } else if (err.status === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: 'Неправильные почта или пароль' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Что-то не так',
        // err: err.message
      });
    }
  });
}
