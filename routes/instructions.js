const router = require("express").Router();
const instructionsControllers = require('../controllers/instructions');

router.get("/", instructionsControllers.getInstructions);

module.exports = router;
