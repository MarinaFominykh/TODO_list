const bcrypt = require('bcryptjs');
const User = require('../models/user');
// const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const createUser = (req, res, next) => {
  const {
    name,
    patronymic,
    surname,
    login,
    password,
    director,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      patronymic,
      surname,
      login,
      password: hash,
      director,

    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким логином уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports = {

  createUser,
};
