import { GoogleApi } from '../google-api';
import { appendRow, transformRowsInArray } from '../utils';

interface DeliveryItem {
  type: string;
  source: string;
  orderCount: number;
  sum: number;
}

interface MetricsData {
  date: string;
  lunch?: { count?: number; sum?: number };
  delivery: DeliveryItem[];
}

export class MetricsGApiController extends GoogleApi {
  saveMetrics = async (data: MetricsData): Promise<void> => {
    const { date, lunch, delivery } = data;
    const api = await this.apiClient;
    const values: (string | number | boolean | undefined)[] = [date];
    const metricsTable = await api.values.get({
      spreadsheetId: this.metricsSpreadsheet,
      range: 'metrics',
    });
    const metrics = transformRowsInArray(metricsTable.data.values);
    const columnsValues = await metricsTable.data.values[0];

    if (lunch && lunch.count) {
      values[1] = lunch.count;
      values[2] = lunch.sum;
    }

    const transformedDelivery: { title: string; value: number }[] = [];

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
      spreadsheetId: this.metricsSpreadsheet,
      range: 'metrics',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });
  };
}

export const metricsGApiController = new MetricsGApiController();
