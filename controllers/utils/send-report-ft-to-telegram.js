const {
  format,
  startOfMonth,
  endOfMonth,
  getDate,
  getMonth,
  getYear,
  getDaysInMonth,
} = require("date-fns");
const {
  createImageFromHtml,
} = require("../../src/create-image-from-html/create-image-from-html");
const maxbot = require("../../src/max-bot/max-bot");
const getMaxChatId = require("../../src/max-bot/get-max-chat-id");
const DailyReportModel = require("../../model/dailyReportFT");

const sendReportFtToTelegram = async ({ type, ...data }) => {
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);

  const currentMonth = getMonth(new Date()) + 1;
  const currentYear = getYear(new Date());

  const reports = await DailyReportModel.find({
    date: new RegExp(`${currentMonth}.${currentYear}`),
  });

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

  await maxbot.sendPhoto(getMaxChatId("reportsFt"), image, undefined, {
    contentType: "image/jpeg",
  });
};

module.exports = sendReportFtToTelegram;
