import { iikoServerApi, metricsGApiController } from '../lib';
import { transformDateString, transformDeliverySales } from '../utils';

export async function saveMetrics(date: string) {
  // const currentDate = transformDateString(date);

  const deliverySales = await iikoServerApi.getDeliverySales(date, date);
  const filteredDeliveriesData = transformDeliverySales(deliverySales);
  const lunchSales = await iikoServerApi.getLunchSales(date, date);

  const data: any = {
    date,
    delivery: filteredDeliveriesData,
    lunch: lunchSales[0]
      ? {
          count: lunchSales[0].UniqOrderId,
          sum: lunchSales[0].DishDiscountSumInt,
        }
      : undefined,
  };

  await metricsGApiController.saveMetrics(data);

  return data;
}
