const userRouter = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');
const urlValidator = require('../utils/urlValidator');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(urlValidator).required,
    }),
  }),
  updateAvatar,
);
userRouter.use(errors());
module.exports = userRouter;
