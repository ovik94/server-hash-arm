const router = require("express").Router();
const metricsControllers = require('../controllers/metrics');

router.post("/save", metricsControllers.saveMetrics);

module.exports = router;
