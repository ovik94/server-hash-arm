const {
  financialOperationsController,
} = require("../src/google-client/controllers");
const DailyReportModel = require("../model/dailyReportFT");
const { sendReportFtToTelegram } = require("./utils");

async function getReports(req, res) {
  const { from, to } = req.query;

  let reports;
  try {
    if (!from && !to) {
      reports = await DailyReportModel.find().sort({ date: 1 });
    }

    if (from || to) {
      const params = {};

      if (from) {
        params.$gte = from;
      }

      if (to) {
        params.$lte = to;
      }

      reports = await DailyReportModel.find({
        date: params,
      }).sort({ date: 1 });
    }
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }

  return res.json({ status: "OK", data: reports });
}

async function addReport(req, res) {
  const { body } = req;

  try {
    const newReport = await DailyReportModel.create(body);

    await financialOperationsController.addFinancialOperation([
      newReport.id,
      body.date,
      "Поступления наличные средства Фудтрак",
      "Наличные",
      body.cash.replace(".", ","),
    ]);

    await sendReportFtToTelegram({ ...body, type: "add" });

    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    console.log(err, "err");
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function updateReport(req, res) {
  const { body } = req;

  try {
    const newReport = await DailyReportModel.findOneAndUpdate(
      { _id: body.id },
      req.body,
      { new: true }
    );

    const operations =
      await financialOperationsController.getFinancialOperations();

    await financialOperationsController.updateFinancialOperation(
      body.id,
      [
        body.date,
        "Поступления наличные средства Фудтрак",
        "Наличные",
        body.cash.replace(".", ","),
      ],
      operations
    );

    await sendReportFtToTelegram({ ...body, type: "update" });

    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

module.exports = { getReports, addReport, updateReport };
