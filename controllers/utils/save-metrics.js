const { format } = require("date-fns");
const transformedDateString = require("../../utils/transform-date-string");
const iikoServerApi = require("../../src/iiko-api/iikoServerApi");
const { metricsController } = require("../../src/google-client/controllers");
const transformDeliverySales = require("./transform-delivery-sales");

const saveMetrics = async (date) => {
  const currentDate = transformedDateString(date);

  const deliverySales = await iikoServerApi.getDeliverySales(
    currentDate,
    currentDate
  );
  const filteredDeliveriesData = transformDeliverySales(deliverySales);
  const lunchSales = await iikoServerApi.getLunchSales(
    currentDate,
    currentDate
  );

  await metricsController.saveMetrics({
    date: currentDate,
    delivery: filteredDeliveriesData,
    lunch: lunchSales[0]
      ? {
        count: lunchSales[0].UniqOrderId,
        sum: lunchSales[0].DishDiscountSumInt,
      }
      : undefined,
  });
};

module.exports = saveMetrics;
