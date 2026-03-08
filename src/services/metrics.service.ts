import { iikoServerApi, metricsGApiController } from '../lib';
import { transformDateString } from '../utils/transform-date-string';
import { transformDeliverySales } from '../utils/delivery';

export async function saveMetrics(date: string) {
  const currentDate = transformDateString(date);

  const deliverySales = await iikoServerApi.getDeliverySales(
    currentDate,
    currentDate
  );
  const filteredDeliveriesData = transformDeliverySales(deliverySales);
  const lunchSales = await iikoServerApi.getLunchSales(
    currentDate,
    currentDate
  );

  const data: any = {
    date: currentDate,
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
