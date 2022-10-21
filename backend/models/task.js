const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  finish: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  priority: {
    type: String,
    enum: ["высокий", "средний", "низкий"],
    required: true,
  },

  status: {
    type: String,
    enum: ["к выполнению", "выполняется", "выполнена", "отменена"],
    required: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  executor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
});

module.exports = mongoose.model('task', taskSchema);
