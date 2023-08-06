const userRouter = require('express').Router();
// const { celebrate, Joi, errors } = require('celebrate'); // не работает
const {
  getUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');
const regEx = require('../utils/regEx');

// userRouter.use(errors());
userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:_id', getUser);
userRouter.patch(
  '/users/me',
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30).required(),
  //     about: Joi.string().min(2).max(30).required(),
  //     // avatar: Joi.string().pattern(regEx),
  //     // email: Joi.string().email().required(),
  //     // password: Joi.string().min(8).required(),
  //   }),
  // }),
  updateUser,
);
userRouter.patch(
  '/users/me/avatar',
  // celebrate({
  //   body: Joi.object().keys({
  //     avatar: Joi.string().pattern(regEx),
  //   }),
  // }),
  updateAvatar,
);

module.exports = userRouter;
