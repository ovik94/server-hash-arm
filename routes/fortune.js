const router = require("express").Router();
const fortuneControllers = require('../controllers/fortune');

router.get("/list", fortuneControllers.getFortuneList);

router.post("/reduce", fortuneControllers.reduce);

module.exports = router;
