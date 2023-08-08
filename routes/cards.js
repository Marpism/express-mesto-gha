const cardRouter = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const regEx = require('../utils/regEx');

cardRouter.get('/cards', getCards);
cardRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(regEx).required(),
    }),
  }),
  createCard,
);
cardRouter.delete(
  '/cards/:cardId',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);
cardRouter.use(errors());

module.exports = cardRouter;
