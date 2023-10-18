const router = require("express").Router();
const counterpartiesV2Controllers = require('../controllers/counterpartiesv2');

router.get("/", counterpartiesV2Controllers.getCounterparties);
router.post("/add", counterpartiesV2Controllers.addCounterparty);
router.post("/edit", counterpartiesV2Controllers.editCounterparty);
router.post("/delete", counterpartiesV2Controllers.deleteCounterparty);

module.exports = router;
