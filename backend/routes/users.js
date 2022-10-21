const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCurrentUser,
  getUsers,
} = require('../controllers/users');

router.use(auth);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
module.exports = router;
