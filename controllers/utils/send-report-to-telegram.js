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
const {
  dailyReportsController,
} = require("../../src/google-client/controllers");
const iikoServerApi = require("../../src/iiko-api/iikoServerApi");
const iikoCloudApi = require("../../src/iiko-api/iikoCloudApi");
const tbot = require("../../src/telegram-bot/tbot");
const getTelegramChatId = require("../../src/telegram-bot/get-telegram-chat-id");
const transformedDate = require("../../src/google-client/controllers/utils/transform-date");
const transformDeliverySales = require("./transform-delivery-sales");

const sendReportToTelegram = async (body) => {
  const currentDate = format(transformedDate(body.date), "yyyy-MM-dd");
  const currentFormattedDate = `${format(
    transformedDate(body.date),
    "yyyy-MM-dd"
  )} 00:00:00.123`;

  const deliverySales = await iikoServerApi.getDeliverySales(
    currentDate,
    currentDate
  );
  const lunchSales = await iikoServerApi.getLunchSales(
    currentDate,
    currentDate
  );
  const reserveIds =
    (await iikoCloudApi.getReserveListIds(
      currentFormattedDate,
      currentFormattedDate
    )) || [];
  const prepays = await iikoCloudApi
    .getCurrentPrepays(reserveIds)
    .then((data) =>
      data.filter((prepay) => {
        const prepayDate = format(new Date(prepay.timestamp), "yyyy-MM-dd");
        return prepayDate === currentDate;
      })
    );

  const filteredDeliveriesData = transformDeliverySales(deliverySales);

  const totalAmount = filteredDeliveriesData.reduce(
    (sum, current) => sum + current.sum,
    0
  );
  const total = filteredDeliveriesData.reduce(
    (sum, current) => sum + current.orderCount,
    0
  );
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);
  const reports = await dailyReportsController.getDailyReports(
    format(startOfMonth(new Date()), "dd.MM.yyyy"),
    format(new Date(), "dd.MM.yyyy")
  );
  const revenue = reports.reduce(
    (sum, current) => Math.floor(Number(sum) + Number(current.totalSum)),
    0
  );

  const image = await createImageFromHtml({
    ...body,
    expenses: (body.expenses || []).map((item) => ({
      ...item,
      title: item.category.title,
    })),
    type: body.type === "add" ? "Отчет" : "Обновление отчета",
    yandex: body.yandex || "0",
    deliveries: filteredDeliveriesData,
    totalDeliveries: total,
    totalDeliveriesSum: totalAmount,
    ...lunchSales[0],
    progressBarStartDate,
    progressBarCurrentDate,
    progressBarEndDate,
    revenue,
    progress: `${progress}%`,
    prepays,
  });

  await tbot.sendPhoto(getTelegramChatId("reports"), image, undefined, {
    contentType: "image/jpeg",
  });
};

module.exports = sendReportToTelegram;
