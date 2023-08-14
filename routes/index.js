const router = require('express').Router();

router.use('/api/user', require('./user'));
router.use('/api/counterparties', require('./counterparties'));
router.use('/api/checkList', require('./check-list'));
router.use('/api/contractors', require('./contractors'));
router.use('/api/instructions', require('./instructions'));
router.use('/api/banquets', require('./banquets'));
router.use('/api/iiko', require('./iiko'));
router.use('/api/lunch', require('./lunch'));
router.use('/api/fortune', require('./fortune'));
router.use('/api/statement', require('./statement'));

router.use('/api/app/dailyReport', require('./daily-report'));
router.use('/api/app/expenses', require('./expense'));

router.use('/api/iiko-cloud', require('./iiko-cloud'));
router.use('/api/iiko-server', require('./iiko-server'));

module.exports = router;
