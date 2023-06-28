const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
      .then(users => res.send({ data: users }))
      .catch((err) => {
        res.status(500).send({
          message: 'Что-то не так',
          err: err.message
        })});
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)

    .then((user) => {
      // res.send({ data: user })
      if (!user) {
        res.status(404).send({
          message: 'Пользователь не найден'
        })
      } else {
        res.status(200).send({ data: user }) //ошибки нет, код 400 не предусмотрен ТЗ
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Что-то не так',
        err: err.message
      })});
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({
          message: 'переданы некорректные данные',
          err: err.message
        })
      } else {
        res.status(500).send({
          message: 'Что-то не так',
          err: err.message
      })}
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
      .then(user => res.send({ data: user })) // ДАННЫЕ В ОТВЕТЕ NULL, 02
      .catch((err) => {
        if (err.message === 'Not found') {
          res.status(404).send({
            message: 'Пользователь не найден'
          })
        } else if (err.message.includes('Validation failed')) {
          res.status(400).send({
            message: 'переданы некорректные данные',
            err: err.message
          })
          } else {
          res.status(500).send({
            message: 'Что-то не так',
            err: err.message
          })}
      });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: req.body.avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Пользователь не найден'
        })
      } else if (err.message.includes('Validation failed')) {
        res.status(400).send({
          message: 'переданы некорректные данные',
          err: err.message
        })
        } else {
        res.status(500).send({
          message: 'Что-то не так',
          err: err.message
        })}
    });
};