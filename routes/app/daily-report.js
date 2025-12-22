const router = require("express").Router();
const dailyReportsControllers = require('../../controllers/daily-report');
const dailyReportsNewControllers = require('../../controllers/daily-report-new');

router.get("/reports", dailyReportsControllers.getReports);
router.get("/reports-new", dailyReportsNewControllers.getReportsNew);

router.get("/clear", dailyReportsControllers.clearReports);

router.post("/add", dailyReportsControllers.addReport);
router.post("/add-new", dailyReportsNewControllers.addReportNew);

router.post("/update", dailyReportsControllers.updateReport);

module.exports = router;
