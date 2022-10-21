const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  patronymic: {
    type: String,
    required: true,
  },

  surname: {
    type: String,
    required: true,
  },

  login: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials({
  login,
  password,
}) {
  return this.findOne({
    login,
  }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Логин или пароль введены неправильно.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Логин или пароль введены неправильно.'));
          }

          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
