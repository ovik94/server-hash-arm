const { format } = require("date-fns");
const iikoServerApi = require("../src/iiko-api/iikoServerApi");
const { metricsController } = require("../src/google-client/controllers");
const transformedDate = require("../src/google-client/controllers/utils/transform-date");

const transformDeliverySales = (data) => {
  const serviceTypes = {
    COURIER: "Курьером",
    PICKUP: "Самовывоз",
  };

  return data
    .filter((deliveryItem) => !!deliveryItem["Delivery.ServiceType"])
    .map((item) => ({
      source: item["Delivery.MarketingSource"] || "По звонку",
      type: serviceTypes[item["Delivery.ServiceType"]],
      orderCount: item.UniqOrderId,
      sum: item.DishDiscountSumInt,
    }));
};

async function saveMetrics(req, res) {
  try {
    const currentDate = format(transformedDate(req.body.date), "yyyy-MM-dd");

    const deliverySales = await iikoServerApi.getDeliverySales(
      currentDate,
      currentDate
    );
    const filteredDeliveriesData = transformDeliverySales(deliverySales);
    const lunchSales = await iikoServerApi.getLunchSales(
      currentDate,
      currentDate
    );

    const data = {
      date: currentDate,
      delivery: filteredDeliveriesData,
      lunch: lunchSales[0]
        ? {
            count: lunchSales[0].UniqOrderId,
            sum: lunchSales[0].DishDiscountSumInt,
          }
        : undefined,
    };

    await metricsController.saveMetrics(data);

    return res.json({ status: "OK", data });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

module.exports = { saveMetrics };
