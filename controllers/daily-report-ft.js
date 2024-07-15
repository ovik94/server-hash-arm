const {
  format,
  startOfMonth,
  endOfMonth,
  getDate,
  getDaysInMonth,
} = require("date-fns");
const {
  createImageFromHtml,
} = require("../src/create-image-from-html/create-image-from-html");
const {
  financialOperationsController,
} = require("../src/google-client/controllers");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const DailyReportModel = require("../model/dailyReportFT");
const tbot = require("../src/telegram-bot/tbot");

const sendReportToTelegram = async ({ type, ...data }) => {
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);

  const reports = await DailyReportModel.find({
    date: {
      $gte: format(startOfMonth(new Date()), "dd.MM.yyyy"),
      $lte: format(new Date(), "dd.MM.yyyy"),
    },
  }).sort({ date: 1 });

  const revenue = reports.reduce(
    (sum, current) => Math.floor(Number(sum) + Number(current.totalSum)),
    0
  );

  const image = await createImageFromHtml(
    {
      ...data,
      type: type === "add" ? "Отчет" : "Обновление отчета",
      progressBarStartDate,
      progressBarCurrentDate,
      progressBarEndDate,
      revenue,
      progress: `${progress}%`,
    },
    "REPORT_FT"
  );

  await tbot.sendPhoto(getTelegramChatId("reportsFt"), image, undefined, {
    contentType: "image/jpeg",
  });
};

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
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: reports });
}

async function addReport(req, res) {
  const { body } = req;

  try {
    const newReport = await DailyReportModel.create(body);

    await financialOperationsController.addFinancialOperation([
      "",
      body.date,
      "Поступления наличные средства Фудтрак",
      "Наличные",
      body.cash.replace(".", ","),
    ]);

    await sendReportToTelegram({ ...body, type: "add" });

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
      { _id: req.body.id },
      req.body,
      { new: true }
    );

    const operations =
      await financialOperationsController.getFinancialOperations();

    await financialOperationsController.updateFinancialOperation(
      undefined,
      [
        body.date,
        "Поступления наличные средства Фудтрак",
        "Наличные",
        body.cash.replace(".", ","),
      ],
      operations
    );

    await sendReportToTelegram({ ...body, type: "update" });

    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

module.exports = { getReports, addReport, updateReport };
