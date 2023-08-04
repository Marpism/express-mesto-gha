const Card = require('../models/cards');
const {
  CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../error_codes/errorCodes');
const BadReqError = require('../errors/BadReqError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthError = require('../errors/UnauthError');

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
        return next(new BadReqError('переданы некорректные данные'))
        // res.status(BAD_REQUEST).send({
        //   message: 'переданы некорректные данные',
        //   // err: err.message
        // });
      }
        // res.status(INTERNAL_SERVER_ERROR).send({
        //   message: 'Что-то не так',
        //   // err: err.message
        // });
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => { //ДОПИСАТЬ ЧТОБЫ УДАЛЯТЬ МОГ ТОЛЬКО ОУНЕР
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
      // const err = new Error();
      // err.status = NOT_FOUND;
      // throw err;
    })
    .then((card) => { res.send({ message: `Карточка ${card._id} успешно удалена` }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
        // res.status(BAD_REQUEST).send({
        //   message: 'переданы некорректные данные',
        //   // err: err.message
        // });
      } else if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
        // res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        next(err)
        // res.status(INTERNAL_SERVER_ERROR).send({
        //   message: 'Что-то не так',
        // });
      }
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
      // const err = new Error();
      // err.status = NOT_FOUND;
      // throw err;
    })
    .then((card) => res.send({ _id: req.params.cardId, likes: card.likes.length }))
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
        // res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
        // res.status(BAD_REQUEST).send({
        //   message: 'переданы некорректные данные',
        //   err: err.name,
        // });
      } else {
        next(err);
        // res.status(INTERNAL_SERVER_ERROR).send({
        //   message: 'Что-то не так',
        // // err: err.message
        // });
      }
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
      // const err = new Error();
      // err.status = NOT_FOUND;
      // throw err;
    })
    .then((card) => res.send({ _id: req.params.cardId, likes: card.likes.length }))
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        return next(new NotFoundError('Карточка не найдена'));
        // res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        return next(new BadReqError('переданы некорректные данные'));
        // res.status(BAD_REQUEST).send({
        //   message: 'переданы некорректные данные',
        //   err: err.name,
        // });
      } else {
        next(err);
        // res.status(INTERNAL_SERVER_ERROR).send({
        //   message: 'Что-то не так',
        // // err: err.message
        // });
      }
    });
};
