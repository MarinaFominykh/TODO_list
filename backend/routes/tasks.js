const router = require('express').Router();
const {
  createTask,
  updateTask,
  getTasks,
} = require('../controllers/tasks');
const auth = require('../middlewares/auth');
const {
  validateCreateTask,
  validateUpdateTask,
} = require('../middlewares/validations');

router.use(auth);
router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.patch('/:id', validateUpdateTask, updateTask);

module.exports = router;
