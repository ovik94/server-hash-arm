const router = require("express").Router();
const banquetsControllers = require('../controllers/banquets');

router.post("/save", banquetsControllers.saveBanquet);

module.exports = router;
