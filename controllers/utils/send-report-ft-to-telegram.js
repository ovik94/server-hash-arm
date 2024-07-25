const {
  format,
  startOfMonth,
  endOfMonth,
  getDate,
  getDaysInMonth,
} = require("date-fns");
const {
  createImageFromHtml,
} = require("../../src/create-image-from-html/create-image-from-html");
const tbot = require("../../src/telegram-bot/tbot");
const getTelegramChatId = require("../../src/telegram-bot/get-telegram-chat-id");
const DailyReportModel = require("../../model/dailyReportFT");

const sendReportFtToTelegram = async ({ type, ...data }) => {
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

  await tbot.sendPhoto(getTelegramChatId("test"), image, undefined, {
    contentType: "image/jpeg",
  });
};

module.exports = sendReportFtToTelegram;
