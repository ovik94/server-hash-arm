const router = require("express").Router();
const dailyReportsControllers = require('../../controllers/daily-report');

router.get("/reports", dailyReportsControllers.getReports);
router.post("/add", dailyReportsControllers.addReport);
router.post("/update", dailyReportsControllers.updateReport);
router.get("/set-reports", dailyReportsControllers.setNewReports);

module.exports = router;
