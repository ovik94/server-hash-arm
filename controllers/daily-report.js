const { v4: uuidv4 } = require("uuid");

const {
  dailyReportsController,
  financialOperationsController,
  expensesController,
} = require("../src/google-client/controllers");
const { sendReportToTelegram, saveMetrics } = require("./utils");

const receiptsOperationValues = {
  ipCash: {
    title: "Поступления наличные средства",
    type: "Наличные",
    comment: "по ИП",
  },
  oooCash: {
    title: "Поступления наличные средства",
    type: "Наличные",
    comment: "по ООО",
  },
};

async function getReports(req, res) {
  try {
    const data = await dailyReportsController.getDailyReports(
      req.query.from,
      req.query.to
    );

    return res.json({ status: "OK", data });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function clearReports(req, res) {
  try {
    await dailyReportsController.clearReport();
    return res.json({ status: "OK" });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function addReport(req, res) {
  const { body } = req;
  const id = uuidv4();
  const data = { ...body, id };
  console.log(data, "data");
  try {
    await dailyReportsController.addReport(data);

    for (const expense of body.expenses) {
      await financialOperationsController.addFinancialOperation([
        expense.id,
        body.date,
        expense.category.title,
        "Наличные",
        expense.sum.replace(".", ","),
        expense.counterparty || "",
        expense.comment || "",
      ]);
    }

    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];

      if (body[receipt]) {
        await financialOperationsController.addFinancialOperation([
          "",
          body.date,
          value.title,
          value.type,
          body[receipt].replace(".", ","),
          value.counterparty || "",
          value.comment || "",
        ]);
      }
    }

    const getExpenses = await expensesController.getExpenses();
    if (getExpenses.length) {
      await expensesController.deleteExpense();
    }

    await sendReportToTelegram({ ...body, type: "add" });
    await saveMetrics(body.date);
  } catch (err) {
    console.log(err, "err");
    return res.json({ status: "ERROR", message: err.message });
  }

  return res.json({ status: "OK", data });
}

async function updateReport(req, res) {
  const { body } = req;

  try {
    const reports = await dailyReportsController.getDailyReports(
      req.query.from,
      req.query.to
    );
    const reportExpenses = (
      reports.find((report) => report.id === body.id) || {}
    ).expenses;
    const oldExpenses =
      typeof reportExpenses === "object"
        ? reportExpenses
        : JSON.parse(reportExpenses || "");
    const operations =
      await financialOperationsController.getFinancialOperations();

    await dailyReportsController.updateReport(body);

    for (const expense of body.expenses) {
      const hasExpense = oldExpenses.find((exp) => exp.id === expense.id);
      if (hasExpense) {
        await financialOperationsController.updateFinancialOperation(
          expense.id,
          [
            body.date,
            expense.category.title,
            "Наличные",
            expense.sum.replace(".", ","),
            expense.counterparty || "",
            expense.comment,
          ],
          operations
        );
      } else {
        await financialOperationsController.addFinancialOperation([
          expense.id,
          body.date,
          expense.category.title,
          "Наличные",
          expense.sum.replace(".", ","),
          expense.counterparty || "",
          expense.comment,
        ]);
      }
    }

    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];
      if (body[receipt]) {
        await financialOperationsController.updateFinancialOperation(
          undefined,
          [
            body.date,
            value.title,
            value.type,
            body[receipt].replace(".", ","),
            value.counterparty || "",
            value.comment,
          ],
          operations
        );
      }
    }

    const idsToDelete = [];
    oldExpenses.forEach((i) => {
      if (!body.expenses.find((j) => j.id === i.id)) {
        idsToDelete.push(i.id);
      }
    });

    if (idsToDelete.length) {
      for (const id of idsToDelete) {
        await financialOperationsController.deleteFinancialOperation(id);
      }
    }

    await sendReportToTelegram({ ...body, type: "update" });
    await saveMetrics(body.date);
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }

  return res.json({ status: "OK" });
}

module.exports = { getReports, clearReports, addReport, updateReport };
