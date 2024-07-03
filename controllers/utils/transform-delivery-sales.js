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

module.exports = transformDeliverySales;
