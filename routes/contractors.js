const router = require("express").Router();
const contractorsControllers = require('../controllers/contractors');

router.get("/", contractorsControllers.getContractors);

router.get("/info", contractorsControllers.getContractorInfo);

router.post("/create", contractorsControllers.createContractor);

module.exports = router;
