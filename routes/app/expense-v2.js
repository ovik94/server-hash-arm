const router = require("express").Router();
const expenseV2Controllers = require('../../controllers/expenseV2');

router.get("/", expenseV2Controllers.getExpenses);
router.post("/add", expenseV2Controllers.addExpense);
router.post("/delete", expenseV2Controllers.deleteExpense);

module.exports = router;
