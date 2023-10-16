const router = require("express").Router();
const expenseControllers = require('../../controllers/expense');

router.get("/", expenseControllers.getExpenses);

router.post("/add", expenseControllers.addExpense);

router.post("/delete", expenseControllers.deleteExpense);

module.exports = router;
