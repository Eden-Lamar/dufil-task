const router = require('express').Router();

router.use('/api/v1', require('./apis'));

module.exports = router;