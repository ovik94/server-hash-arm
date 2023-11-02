const router = require("express").Router();
const dailyReportsV2Controllers = require('../../controllers/daily-report-v2');

router.get("/reports", dailyReportsV2Controllers.getReports);

router.get("/save-report-to-mongo", dailyReportsV2Controllers.saveReportsToMongo);

router.post("/add", dailyReportsV2Controllers.addReport);

router.post("/update", dailyReportsV2Controllers.updateReport);

module.exports = router;
