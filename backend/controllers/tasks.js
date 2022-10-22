const Task = require('../models/task');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

// POST /tasks - создание задачи
const createTask = (req, res, next) => {
  const {
    title,
    description,
    finish,
    start,
    priority,
    status,
    executor,
  } = req.body;

  Task.create({
    title,
    description,
    finish,
    start,
    priority,
    status,
    executor,
    author: req.user._id,
  })
    .then((task) => res.send(task))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

// GET /tasks — получить все задачи
const getTasks = (req, res, next) => {
  Task.find({})
    .populate({
      path: 'executor',
      select: ['surname', 'patronymic', 'name'],
    })
    .then((tasks) => res.send(tasks))
    .catch(next);
};

// PATCH /tasks/:id - обновление задачи
const updateTask = (req, res, next) => {
  const {
    title,
    description,
    finish,
    start,
    priority,
    status,
    executor,
  } = req.body;
  Task.findByIdAndUpdate(req.params.id, {
    title,
    description,
    finish,
    start,
    priority,
    status,
    executor,
  }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => next(new NotFoundError('Задача не найдена')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении задачи.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createTask,
  updateTask,
  getTasks,
};
