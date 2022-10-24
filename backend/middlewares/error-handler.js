const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('../constants');

module.exports = (err, req, res, next) => {
  // console.log(err);
  // если у ошибки нет статуса - выставить 500
  const { statusCode = ERROR_CODE_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка.'
        : message,
    });
  next();
};
