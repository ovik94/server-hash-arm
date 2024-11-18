const router = require("express").Router();
const iikoCloudControllers = require("../../controllers/iiko-cloud");

router.get("/reserve-list", iikoCloudControllers.getReserveList);

router.get("/current-prepays", iikoCloudControllers.getCurrentPrepays);
router.get("/menu-list", iikoCloudControllers.getMenuList);
router.post("/menu", iikoCloudControllers.getMenu);

module.exports = router;
