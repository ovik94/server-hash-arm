import {
  format,
  startOfMonth,
  endOfMonth,
  getDate,
  getMonth,
  getYear,
  getDaysInMonth,
} from "date-fns";
import {
  createImageFromHtml,
  TemplateTypes,
  tbot,
  dailyReportsGApiController,
  iikoServerApi,
  iikoCloudApi
} from "../lib";
import { getTelegramChatId } from "../lib/telegram-bot";

import { DailyReportFTModel } from "../models";
import { transformDateString } from "./transform-date-string";
import { transformDeliverySales } from "./delivery";

export const sendReportFtToTelegram = async ({
  type,
  ...data
}: {
  type: "add" | "update";
  [key: string]: any;
}) => {
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);

  const currentMonth = getMonth(new Date()) + 1;
  const currentYear = getYear(new Date());

  const reports = await DailyReportFTModel.find({
    date: new RegExp(`${currentMonth}.${currentYear}`),
  });

  const revenue = reports.reduce(
    (sum: number, current: any) =>
      Math.floor(Number(sum) + Number(current.totalSum)),
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
    TemplateTypes.REPORT_FT
  ) as string | Buffer;

  await tbot.sendPhoto(getTelegramChatId("reportsFt"), image, undefined, {
    contentType: "image/jpeg",
  });
};

export const sendReportToTelegram = async (body: any) => {
  const currentDate = transformDateString(body.date);
  const currentFormattedDate = `${transformDateString(
    body.date
  )} 00:00:00.123`;

  const cashPayments = await iikoServerApi.getOlapCashPayments(
    currentDate
  );

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
  .then((data: any[]) =>
    data.filter((prepay) => {
      const prepayDate = format(new Date(prepay.timestamp), "yyyy-MM-dd");
      return prepayDate === currentDate;
    })
  );
  const transformedCashPayments = cashPayments.length
    ? cashPayments.map((item: any) => ({
      name: item.CashRegisterName,
      sum: item.DiscountSum,
    }))
    : undefined;

  const filteredDeliveriesData = transformDeliverySales(deliverySales);

  const totalAmount = filteredDeliveriesData.reduce(
    (sum: number, current: any) => sum + current.sum,
    0
  );
  const total = filteredDeliveriesData.reduce(
    (sum: number, current: any) => sum + current.orderCount,
    0
  );
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);
  const reports = await dailyReportsGApiController.getDailyReports(
    format(startOfMonth(new Date()), "dd.MM.yyyy"),
    format(new Date(), "dd.MM.yyyy")
  );
  const revenue = reports.reduce(
    (sum: number, current: any) =>
      Math.floor(Number(sum) + Number(current.totalSum)),
    0
  );

  const image = await createImageFromHtml(
    {
      ...body,
      expenses: (body.expenses || []).map((item: any) => ({
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
      cashPayments: transformedCashPayments,
    },
    TemplateTypes.REPORT
  ) as string | Buffer;

  await tbot.sendPhoto(getTelegramChatId("balance"), image, undefined, {
    contentType: "image/jpeg",
  });
};

