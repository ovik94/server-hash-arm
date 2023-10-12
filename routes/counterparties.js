const router = require("express").Router();
const counterpartiesControllers = require('../controllers/counterparties');

router.get("/", counterpartiesControllers.getCounterparties);

module.exports = router;
