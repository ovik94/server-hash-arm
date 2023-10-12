const router = require("express").Router();
const lunchControllers = require('../controllers/lunch');

router.get("/menu-for-today", lunchControllers.sendLunchTelegram);

router.get("/menu-for-today-vk", lunchControllers.sendLunchVk);

module.exports = router;
