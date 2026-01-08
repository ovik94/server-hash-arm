const {
  financialOperationsController, dailyReportsController,
} = require("../src/google-client/controllers");
const { sendReportToTelegram } = require("./utils");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const DailyReportModel = require("../model/dailyReport");
const transformedDateString = require("../utils/transform-date-string");


/** Дата в запросе от клиента приходит в формате dd.MM.yyyy
 *  В базу сохраняется в формате yyyy-MM-dd*/

async function getReports(req, res) {
  const { from, to } = req.query;
  const findQuery = {};

  if (from && to) {
    findQuery.date = {
      $gte: transformedDateString(from),
      $lte: transformedDateString(to)
    };
  } else if (from) {
    findQuery.date = {
      $gte: transformedDateString(from)
    };
  } else if (to) {
    findQuery.date = {
      $lte: transformedDateString(to)
    };
  }

  try {
    const reports = await DailyReportModel.find(findQuery).sort({ date: 1 });

    return res.json({ status: "OK", data: reports });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function addReport(req, res) {
  const { body } = req;

  const date = transformedDateString(body.date);

  try {
    const newReport = await DailyReportModel.create({ ...body, date });

    for (const expense of body.expenses) {
      await financialOperationsController.addFinancialOperation([
        expense.id,
        body.date,
        expense.cashFlowStatement,
        "Наличные",
        expense.sum.replace(".", ","),
        expense.counterparty || "",
        expense.comment || "",
      ]);
    }

    for (const receipt of ['ipCash', 'oooCash']) {
      if (body[receipt]) {
        await financialOperationsController.addFinancialOperation([
          `${newReport.id}-${receipt}`,
          body.date,
          "Поступления наличные средства",
          "Наличные",
          body[receipt].replace(".", ","),
          "",
          receipt === 'ipCash' ? "по ИП" : "по ООО",
        ]);
      }
    }

    // await sendReportToTelegram({ ...body, type: "add" });
    // await saveMetrics(body.date);
    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    console.error(err, "error-add-daily-report");
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function updateReport(req, res) {
  const { body } = req;

  try {
    const report = await DailyReportModel.findOne({
      _id: body.id
    });

    const reportExpenses = report?.expenses;

    const operations =
      await financialOperationsController.getFinancialOperations();

    for (const expense of body.expenses) {
      const hasExpense = reportExpenses.find((exp) => exp.id === expense.id);
      if (hasExpense) {
        await financialOperationsController.updateFinancialOperation(
          expense.id,
          [
            body.date,
            expense.cashFlowStatement,
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
          expense.cashFlowStatement,
          "Наличные",
          expense.sum.replace(".", ","),
          expense.counterparty || "",
          expense.comment,
        ]);
      }
    }

    for (const receipt of ['ipCash', 'oooCash']) {
      if (body[receipt]) {
        await financialOperationsController.updateFinancialOperation(
          `${report.id}-${receipt}`,
          [
            body.date,
            "Поступления наличные средства",
            "Наличные",
            body[receipt].replace(".", ","),
            "",
            receipt === 'ipCash' ? "по ИП" : "по ООО",
          ],
          operations
        );
      }
    }

    const idsToDelete = [];
    reportExpenses.forEach((i) => {
      if (!body.expenses.find((j) => j.id === i.id)) {
        idsToDelete.push(i.id);
      }
    });

    if (idsToDelete.length) {
      for (const id of idsToDelete) {
        await financialOperationsController.deleteFinancialOperation(id);
      }
    }

    const newReport = await DailyReportModel.findOneAndUpdate(
      { _id: body.id },
      { ...body, date: transformedDateString(body.date) },
      {
        new: true,
        runValidators: true
      }
    );

    // await sendReportToTelegram({ ...body, type: "update" });
    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function setNewReports(req, res) {
  try {
    const reports = await dailyReportsController.getDailyReports();

    const transformReports = reports.map((report) => {
      const data = { ...report };
      const online = data.ipOnline;

      delete data.id;
      delete data.ipOnline;
      delete data.expenses;

      return { ...data, online, date: transformedDateString(data.date) };
    });

    await DailyReportModel.insertMany(transformReports);

    return res.json({ status: "OK" });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}


module.exports = { addReport, getReports, updateReport, setNewReports };
