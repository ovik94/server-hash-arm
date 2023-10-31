const router = require("express").Router();
const counterpartiesControllers = require('../controllers/counterparties');

router.get("/", counterpartiesControllers.getCounterparties);
router.post("/add", counterpartiesControllers.addCounterparty);
router.post("/edit", counterpartiesControllers.editCounterparty);
router.post("/delete", counterpartiesControllers.deleteCounterparty);

module.exports = router;
