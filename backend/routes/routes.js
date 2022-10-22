const router = require('express').Router();
const taskRouter = require('./tasks');
const userRouter = require('./users');

const {
  createUser,
  loginUser,
} = require('../controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, loginUser);

router.use('/tasks', taskRouter);
router.use('/users', userRouter);

// Обработка несуществующего маршрута
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница отсутствует'));
});

module.exports = router;
