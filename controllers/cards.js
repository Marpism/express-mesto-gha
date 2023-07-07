const Card = require('../models/cards');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../error_codes/errorCodes')

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Что-то не так',
        err: err.message
      })});
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      console.log(card);
      if (card == null) {
        res.status(NOT_FOUND).send({
          message: 'Карточка не найдена'
        })
      } else {
        res.send({ message: `Карточка ${card._id} успешно удалена` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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

module.exports.likeCard = (req, res) => {Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then(card => res.send({ _id: req.params.cardId, likes: card.likes.length }))
  .catch((err) => {
    if (err.message.includes('Cannot read properties')) {
      res.status(NOT_FOUND).send({
        message: 'Карточка не найдена',
        err: err.message
      })
    } else if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'переданы некорректные данные',
        err: err.name
      })
      } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Что-то не так',
        err: err.message
      })}
  });
}

module.exports.dislikeCard = (req, res) => {Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
.then(card => res.send({ _id: req.params.cardId, likes: card.likes.length }))
.catch((err) => {
  if (err.message.includes('Cannot read properties')) {
    res.status(NOT_FOUND).send({
      message: 'Карточка не найдена',
      err: err.message
    })
  } else if (err.name === 'CastError' || err.name === 'ValidationError') {
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
}

