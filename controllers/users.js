const User = require('../models/users');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../error_codes/errorCodes')

module.exports.getUsers = (req, res) => {
  User.find({})
      .then(users => res.send({ data: users }))
      .catch((err) => {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
          err: err.message
        })});
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id, {lean: false }, {runValidators: true})
    .then(user => {
      if (!user) {
        res.status(NOT_FOUND).send({
          message: 'Пользователь не найден'
        })
      }
      else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          err: err.message
        })
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Что-то не так',
        // err: err.name
      })}
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(CREATED).send({data: user}))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          err: err.message
        })
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
          err: err.message
      })}
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err.message === 'Not found') {
          res.status(NOT_FOUND).send({
            message: 'Пользователь не найден'
          })
        } else if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({
            message: 'переданы некорректные данные',
            err: err.message
          })
          } else {
          res.status(INTERNAL_SERVER_ERROR).send({
            message: 'Что-то не так',
            err: err.message
          })}
      });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: req.body.avatar }, {new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь не найден'
        })
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
          err: err.message
        })
        }
         else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Что-то не так',
          err: err.message
        })}
    });
};

// module.exports.notFoundError = (req, res) => {
//   res.status(NOT_FOUND).send({
//     message: 'Страницы не существует'
//   })
// }