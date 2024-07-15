const router = require("express").Router();
const dailyReportsFTControllers = require("../../controllers/daily-report-ft");

router.get("/reports", dailyReportsFTControllers.getReports);

router.post("/add", dailyReportsFTControllers.addReport);

router.post("/update", dailyReportsFTControllers.updateReport);

module.exports = router;
