const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use(auth);
module.exports = router;
