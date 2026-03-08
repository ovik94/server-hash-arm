import { iikoServerApi } from '../lib';

export async function getLunchSales(dateFrom: string, dateTo: string) {
  return iikoServerApi.getLunchSales(dateFrom, dateTo);
}
