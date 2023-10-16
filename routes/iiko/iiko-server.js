const router = require("express").Router();
const iikoServerControllers = require('../../controllers/iiko-server');

router.post("/get-lunch-sales", iikoServerControllers.getLunchSales);

module.exports = router;
