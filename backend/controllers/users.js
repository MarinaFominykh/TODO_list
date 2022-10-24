const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const {
  NODE_ENV,
  JWT_SECRET = 'dev-key',
} = process.env;

// POST /signup
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

// POST /signin

const loginUser = (req, res, next) => {
  const {
    login,
    password,
  } = req.body;
  User.findUserByCredentials({
    login,
    password,
  })
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key', {
        expiresIn: '21d',
      });
      res.send({
        token,
      });
    })
    .catch(next);
};

// GET /users/me — получить данные текущего пользователя
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден.')))
    .then((user) => res.send(user))
    .catch(next);
};

// GET /users — все пользователи
const getUsers = (req, res, next) => {
  User.find({})
    .populate({
      path: 'director',
    })
    .then((users) => res.send(users))
    .catch(next);
};
module.exports = {

  createUser,
  loginUser,
  getCurrentUser,
  getUsers,
};
