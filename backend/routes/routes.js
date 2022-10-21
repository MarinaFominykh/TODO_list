const router = require('express').Router();
// const userRouter = require('./users');

const {
  createUser,
  // login,
} = require('../controllers/users');
const {
  validateCreateUser,
  // validateLogin,
} = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateCreateUser, createUser);
// router.post('/signin', validateLogin, login);

// router.use('/users', userRouter);

// Обработка несуществующего маршрута
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница отсутствует'));
});

module.exports = router;
