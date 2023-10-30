const router = require("express").Router();
const banquetsControllers = require('../controllers/banquets');

router.get("/reserve", banquetsControllers.getBanquetReserve);
router.get("/reserves", banquetsControllers.getBanquetReservesList);
router.post("/save", banquetsControllers.saveBanquet);
router.post("/edit", banquetsControllers.editBanquet);
router.post("/delete", banquetsControllers.deleteBanquet);

module.exports = router;
