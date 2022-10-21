const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);
