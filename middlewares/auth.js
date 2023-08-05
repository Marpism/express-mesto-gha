const jwt = require('jsonwebtoken');
const UnauthError = require('../errors/UnauthError');
const { UNAUTHORIZED } = require('../error_codes/errorCodes')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {

    throw new UnauthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (next) {
    // next(err)
    // return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};