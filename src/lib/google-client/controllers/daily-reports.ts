import { isAfter, isBefore } from 'date-fns';
import { GoogleApi } from '../google-api';
import { transformRowsInArray } from '../utils';

const transformedDate = (date: string): Date => {
  const dateArray = date.split('.');
  const day = Number(dateArray[0]);
  const month = Number(dateArray[1]) - 1;
  const year = Number(dateArray[2]);
  return new Date(year, month, day);
};

interface DailyReport {
  id: string;
  date: string;
  adminName: string;
  ipCash: number;
  ipAcquiring: number;
  oooCash: number;
  oooAcquiring: number;
  totalSum: number;
  totalCash: number;
  yandex: number;
  expenses: string[];
  ipNetmonet: number;
  ipOnline: number;
  oooNetmonet: number;
}

export class DailyReportsGApiController extends GoogleApi {
  getDailyReports = async (
    from?: string,
    to?: string
  ): Promise<DailyReport[]> => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'dailyReports',
    });
    const reports = transformRowsInArray(data.values);
    let result = reports.map((item) => ({
      ...item,
      expenses: item.expenses ? JSON.parse(item.expenses as string) : [],
    })) as DailyReport[];

    if (from) {
      result = result.filter((item) => {
        if (item.date === from) {
          return true;
        }
        return isAfter(transformedDate(item.date), transformedDate(from));
      });
    }

    if (to) {
      result = result.filter((item) => {
        if (item.date === to) {
          return true;
        }
        return isBefore(transformedDate(item.date), transformedDate(to));
      });
    }

    return result;
  };
}

export const dailyReportsGApiController = new DailyReportsGApiController();
