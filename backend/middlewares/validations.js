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

// POST /

const validateCreateTask = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    finish: Joi.date().required(),
    start: Joi.date().required(),
    priority: Joi.string().required(),
    status: Joi.string().required(),
    executor: Joi.required(),
  }).unknown(true),
});

// PATCH /

const validateUpdateTask = celebrate({
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    finish: Joi.date(),
    start: Joi.date(),
    priority: Joi.string(),
    status: Joi.string(),
  }).unknown(true),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCreateTask,
  validateUpdateTask,
};
