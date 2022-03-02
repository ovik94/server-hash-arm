const router = require('express').Router();

router.use('/api/user', require('./user'));
router.use('/api/checkList', require('./check-list'));
router.use('/api/contractors', require('./contractors'));
router.use('/api/instructions', require('./instructions'));
router.use('/api/banquets', require('./banquets'));
router.use('/api/iiko', require('./iiko'));
router.use('/api/lunch', require('./lunch'));

module.exports = router;