const router = require('express').Router();

router.use('/api/user', require('./user'));
router.use('/api/v2/counterparties', require('./counterparties'));
router.use('/api/checkList', require('./check-list'));
router.use('/api/instructions', require('./instructions'));
router.use('/api/banquets', require('./banquets'));
router.use('/api/lunch', require('./lunch'));
router.use('/api/wheel-of-fortune', require('./wheel-of-fortune'));
router.use('/api/feedback', require('./feedback'));
router.use('/api/statement', require('./statement'));

router.use('/api/metrics', require('./metrics'));

// iiko
router.use('/api/iiko', require('./iiko/iiko'));
router.use('/api/iiko-cloud', require('./iiko/iiko-cloud'));
router.use('/api/iiko-server', require('./iiko/iiko-server'));

// app
router.use('/api/app/dailyReport', require('./app/daily-report'));
router.use('/api/app/expenses', require('./app/expense'));
router.use('/api/v2/app/expenses', require('./app/expense-v2'));
router.use('/api/v2/app/dailyReport', require('./app/daily-report-v2'));

module.exports = router;
