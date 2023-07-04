const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({
        message: 'Что-то не так',
        err: err.message
      })});
};

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
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

module.exports.deleteCard = (req, res) => {
  // const { userId } = req.params;
  Card.findByIdAndRemove(req.params._id, { new: true, runValidators: true })
    .then(() => res.send({ message: 'Карточка удалена'}))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Карточка не найдена'
        })
      } else {
        res.status(500).send({
        message: 'Что-то не так',
        err: err.message
      })}
    });
};

module.exports.likeCard = (req, res) => {Card.findByIdAndUpdate(
  req.params._id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'Not found') {
      res.status(404).send({
        message: 'Пользователь не найден',
        err: err.message
      })
    } else if (err.message.includes('Cast to ObjectId failed')) {
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
}

module.exports.dislikeCard = (req, res) => {Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true, runValidators: true },
)
.then(card => res.send({ data: card }))
.catch((err) => {
  if (err.message.includes('Cast')) {
    res.status(404).send({
      message: 'Пользователь не найден'
    })
  } else if (err.message.includes('validation failed')) {
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
}

