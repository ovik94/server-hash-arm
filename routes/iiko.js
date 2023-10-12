const router = require("express").Router();
const iikoControllers = require('../controllers/iiko');

router.get("/menu", iikoControllers.getMenu);

router.get("/menuItem", iikoControllers.getMenuItem);

router.get("/bar-balance", iikoControllers.getBarBalance);

module.exports = router;
