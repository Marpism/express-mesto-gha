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
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена'}))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res.status(404).send({
          message: 'Карточка не найдена',
          err: err.message
        })
      } else {
        res.status(500).send({
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
    if (err.message.includes('Not found')) {
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
.then(card => res.send({ _id: req.params.cardId, likes: card.likes.length }))
.catch((err) => {
  if (err.message.includes('Cast to ObjectId failed for value')) {
    res.status(404).send({
      message: 'Пользователь не найден',
      err: err.message
    })
  } else if (err.message.includes('validation failed')) {
    res.status(400).send({
      message: 'переданы некорректные данные',
      err: err.message
    })
    }
    else {
    res.status(500).send({
      message: 'Что-то не так',
      err: err.message
    })}
  });
}

