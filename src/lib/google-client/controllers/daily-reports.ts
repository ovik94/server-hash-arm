import { isAfter, isBefore } from 'date-fns';
import { GoogleApi } from '../google-api';
import {
  appendRow,
  deleteRows,
  updateRow,
  transformRowsInArray,
} from '../utils';

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

  addReport = async (data: DailyReport): Promise<void> => {
    const {
      id,
      date,
      adminName,
      ipCash,
      ipAcquiring,
      oooCash,
      oooAcquiring,
      totalSum,
      totalCash,
      yandex,
      expenses,
      ipNetmonet,
      ipOnline,
      oooNetmonet,
    } = data;
    const api = await this.apiClient;

    await appendRow(api, {
      spreadsheetId: this.spreadsheet,
      range: 'dailyReports',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [
            id,
            date,
            adminName,
            ipCash,
            ipAcquiring,
            oooCash,
            oooAcquiring,
            totalSum,
            totalCash,
            yandex,
            JSON.stringify(expenses),
            ipNetmonet,
            ipOnline,
            oooNetmonet,
          ],
        ],
      },
    });
  };

  updateReport = async (data: DailyReport): Promise<void> => {
    const {
      id,
      date,
      adminName,
      ipCash,
      ipAcquiring,
      oooCash,
      oooAcquiring,
      totalSum,
      totalCash,
      yandex,
      expenses,
      ipNetmonet,
      ipOnline,
      oooNetmonet,
    } = data;
    const api = await this.apiClient;

    const reports = await this.getDailyReports();
    const reportRowIndex = reports.findIndex((item) => item.id === id) + 2;

    if (reportRowIndex) {
      await updateRow(api, {
        spreadsheetId: this.spreadsheet,
        range: `dailyReports!A${reportRowIndex}:N${reportRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            [
              id,
              date,
              adminName,
              ipCash,
              ipAcquiring,
              oooCash,
              oooAcquiring,
              totalSum,
              totalCash,
              yandex,
              JSON.stringify(expenses),
              ipNetmonet,
              ipOnline,
              oooNetmonet,
            ],
          ],
        },
      });
    }
  };

  clearReport = async (): Promise<void> => {
    const api = await this.apiClient;
    const reports = await this.getDailyReports();

    await deleteRows(api, {
      spreadsheetId: this.spreadsheet,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 877273327,
                dimension: 'ROWS',
                startIndex: 1,
                endIndex: reports.length - 30,
              },
            },
          },
        ],
      },
    });
  };
}

export const dailyReportsGApiController = new DailyReportsGApiController();
