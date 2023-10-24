const router = require("express").Router();
const wheelOfFortuneControllers = require('../controllers/wheelOfFortune');

router.get("/list", wheelOfFortuneControllers.getWheelOfFortuneList);
router.get("/data", wheelOfFortuneControllers.getWheelOfFortuneData);
router.post("/add", wheelOfFortuneControllers.addWheelOfFortune);
router.post("/delete", wheelOfFortuneControllers.deleteWheelOfFortune);
router.post("/edit", wheelOfFortuneControllers.editWheelOfFortune);

module.exports = router;
