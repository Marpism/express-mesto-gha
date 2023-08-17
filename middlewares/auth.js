const jwt = require('jsonwebtoken');
const UnauthError = require('../errors/UnauthError');
const { UNAUTHORIZED } = require('../utils/errorCodes');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, (NODE_ENV === 'production') ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new UnauthError('Необходима авторизация'));
    // next(err)
    // return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  return next();
};
