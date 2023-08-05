const validator = require('validator');
const mongoose = require('mongoose');

const { isEmail, isURL } = validator;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: { // валидировать регулярным выражением
    type: String,
    validate: {
      validator(url) {
        return isURL(url)
      },
      message: 'Введены некорректные данные'
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return isEmail(email)
      },
      message: 'Введены некорректные данные'
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
