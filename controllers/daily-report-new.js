const { format, parseISO } = require("date-fns");
const moment = require("moment-timezone");

const {
  financialOperationsController,
} = require("../src/google-client/controllers");
const { sendReportToTelegram, saveMetrics } = require("./utils");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const DailyReportModel = require("../model/dailyReport");

const NSK_TIMEZONE = 'Asia/Novosibirsk';

async function getReportsNew(req, res) {
  const { from, to } = req.query;
  let findQuery = {};

  try {
    if (from) {
      const startMomentUTC = moment.utc(from);
      const startOfNSKDay = startMomentUTC.tz(NSK_TIMEZONE).startOf('day');
      const queryStartDate = startOfNSKDay.toDate();

      console.log('startMomentUTC: ', startMomentUTC, 'startOfNSKDay: ', startOfNSKDay, 'queryStartDate: ', queryStartDate)

      findQuery = {
        ...findQuery,
        date: { $gte: queryStartDate }
      };
    }

    if (to) {
      const endMomentUTC = moment.utc(to);
      const endOfNSKDay = endMomentUTC.tz(NSK_TIMEZONE).endOf('day');
      const queryEndDate = endOfNSKDay.toDate();

      findQuery = {
        ...findQuery,
        date: { ...findQuery.date, $lte: queryEndDate }
      };
    }

    console.log(findQuery, 'findQuery');
    const reports = await DailyReportModel.find(findQuery).sort({ date: 1 });

    return res.json({ status: "OK", data: reports });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function addReportNew(req, res) {
  const { body } = req;

  const data = { ...body, date: moment(req.body.date).utc().toDate() };

  const formattedDate = format(parseISO(req.body.date), "dd.MM.yyyy");

  try {
    const newReport = await DailyReportModel.create(data);

    for (const expense of body.expenses) {
      await financialOperationsController.addFinancialOperation([
        expense.id,
        formattedDate,
        expense.cashFlowStatement,
        "Наличные",
        expense.sum.replace(".", ","),
        expense.counterparty || "",
        expense.comment || "",
      ]);
    }

    for (const receipt of Object.keys(['ipCash', 'oooCash'])) {
      if (body[receipt]) {
        await financialOperationsController.addFinancialOperation([
          newReport.id,
          formattedDate,
          "Поступления наличные средства",
          "Наличные",
          body[receipt].replace(".", ","),
          "",
          receipt === 'ipCash' ? "по ИП" : "по ООО",
        ]);
      }
    }

    // await sendReportToTelegram({ ...body, type: "add" });
    // await saveMetrics(formattedDate);
    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    console.error(err, "error-add-daily-report");
    return res.json({ status: "ERROR", message: err.message });
  }
}


module.exports = { addReportNew, getReportsNew };
