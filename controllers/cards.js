const Card = require('../models/cards');
const {
  CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/errorCodes');
const BadReqError = require('../errors/BadReqError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthError = require('../errors/UnauthError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReqError('переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => { // ДОПИСАТЬ ЧТОБЫ УДАЛЯТЬ МОГ ТОЛЬКО ОУНЕР
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return card.deleteOne()
        .then((deletedCard) => res.send({ message: `Карточка ${deletedCard._id} успешно удалена` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
      } if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send({ _id: req.params.cardId, likes: card.likes.length }))
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
      } if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send({ _id: req.params.cardId, likes: card.likes.length }))
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
      } if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
      }
      return next(err);
    });
};
