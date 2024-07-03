const GoogleApi = require("../google-api");
const transformRowsInArray = require("../utils/transform-rows-in-array");
const { appendRow } = require("../utils/tableTransformMethods");

class MetricsGApiController extends GoogleApi {
  saveMetrics = async (data) => {
    const { date, lunch, delivery } = data;
    const api = await this.apiClient;
    const values = [date];
    const metricsTable = await api.values.get({
      spreadsheetId: this.metricsSpreadsheet,
      range: "metrics",
    });
    const metrics = transformRowsInArray(metricsTable.data.values);
    const columnsValues = await metricsTable.data.values[0];

    if (lunch && lunch.count) {
      values[1] = lunch.count;
      values[2] = lunch.sum;
    }

    const transformedDelivery = [];

    for (const deliveryItem of delivery) {
      transformedDelivery.push({
        title: `Кол-во ${deliveryItem.type.toLowerCase()} ${deliveryItem.source.toLowerCase()}`,
        value: deliveryItem.orderCount,
      });

      transformedDelivery.push({
        title: `Сумма ${deliveryItem.type.toLowerCase()} ${deliveryItem.source.toLowerCase()}`,
        value: deliveryItem.sum,
      });
    }

    for (const valueItem of transformedDelivery) {
      const index = columnsValues.findIndex(
        (item) => item.toLowerCase() === valueItem.title.toLowerCase()
      );
      values[index] = valueItem.value;
    }

    await appendRow(api, {
      sheet: this.metricsSpreadsheet,
      range: "metrics",
      values,
    });
  };
}

module.exports = new MetricsGApiController();
