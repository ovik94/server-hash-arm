const router = require("express").Router();
const checkListControllers = require('../controllers/check-list');

router.get("/", checkListControllers.getCheckList);

module.exports = router;
