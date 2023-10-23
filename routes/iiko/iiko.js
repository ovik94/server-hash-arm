const router = require("express").Router();
const iikoControllers = require('../../controllers/iiko');

router.get("/menu", iikoControllers.getMenu);
router.get("/menuItem", iikoControllers.getMenuItem);
router.get("/bar-balance", iikoControllers.getBarBalance);
router.get("/bar-nomenclature", iikoControllers.getBarNomenclature);
router.post("/save-bar-limits", iikoControllers.saveBarLimits);

module.exports = router;
