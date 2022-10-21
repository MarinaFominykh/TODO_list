const {
  celebrate,
  Joi,
} = require('celebrate');

// POST /signup
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    patronymic: Joi.string().required(),
    surname: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
});

// POST /signin
const validateLogin = celebrate({
  body: Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
};
