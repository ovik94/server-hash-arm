const router = require("express").Router();
const lunchControllers = require("../controllers/lunch");

router.get("/menu-for-today", lunchControllers.sendLunchTelegram);
router.get("/menu-for-today-vk", lunchControllers.sendLunchVk);
router.get("/get-week", lunchControllers.getLunchWeek);

module.exports = router;
