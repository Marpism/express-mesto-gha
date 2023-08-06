const userRouter = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');
const regEx = require('../utils/regEx');

userRouter.use(errors());
userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:_id', getUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
