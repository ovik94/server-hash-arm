const router = require("express").Router();
const statementControllers = require("../controllers/statement");

router.post("/load", statementControllers.load);
router.post("/process", statementControllers.process);

module.exports = router;
