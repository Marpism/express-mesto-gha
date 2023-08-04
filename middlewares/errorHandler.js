const { INTERNAL_SERVER_ERROR } = require('../error_codes/errorCodes')

module.exports = ((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
console.log(statusCode)
  res.status(statusCode).send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
    console.log(statusCode)
  next()
});

// module.exports = (err, req, res, next) => {
//   const statusCode = err.statusCode ?? INTERNAL_SERVER_ERROR;
//   const message = (statusCode === INTERNAL_SERVER_ERROR)
//     ? 'Произошла ошибка сервера'
//     : err.message;
//   res.status(statusCode).send({ message });
//   next();
// };