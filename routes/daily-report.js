const router = require("express").Router();
const dailyReportsControllers = require('../controllers/daily-report');

router.get("/reports", dailyReportsControllers.getReports);

router.get("/clear", dailyReportsControllers.clearReports);

router.post("/add", dailyReportsControllers.addReport);

router.post("/update", dailyReportsControllers.updateReport);

module.exports = router;
