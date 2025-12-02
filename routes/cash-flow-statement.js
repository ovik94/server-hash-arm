const router = require("express").Router();
const cashFlowStatementControllers = require('../controllers/cash-flow-statement');

router.get("/", cashFlowStatementControllers.getCashFlowStatement);
router.post("/add", cashFlowStatementControllers.addCashFlowStatement);
router.post("/edit", cashFlowStatementControllers.editCashFlowStatement);
router.post("/delete", cashFlowStatementControllers.deleteCashFlowStatement);

module.exports = router;
