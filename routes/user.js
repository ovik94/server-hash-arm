const router = require('express').Router();

router.get('/', function(req, res, next) {
  return res.json({ status: 'OK' });
});

module.exports = router;