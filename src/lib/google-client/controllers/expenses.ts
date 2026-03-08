import { GoogleApi } from '../google-api';
import { appendRow, deleteRows, transformRowsInArray } from '../utils';

interface Expense {
  id: string;
  sum: number;
  comment: string;
  category: string;
  counterparty: string;
}

export class ExpensesGApiController extends GoogleApi {
  getExpenses = async (): Promise<
    Record<string, boolean | string | undefined>[]
  > => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'expenses',
    });

    return transformRowsInArray(data.values);
  };

  getExpenseIds = async (): Promise<string[][]> => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'expenses!A:A',
    });

    return data.values;
  };

  addExpense = async ({
    id,
    sum,
    comment,
    category,
    counterparty,
  }: Expense): Promise<void> => {
    const api = await this.apiClient;

    await appendRow(api, {
      spreadsheetId: this.spreadsheet,
      range: 'expenses',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[id, sum, comment, JSON.stringify(category), counterparty]],
      },
    });
  };

  deleteExpense = async (id: string): Promise<void> => {
    const api = await this.apiClient;

    if (id) {
      const ids = await this.getExpenseIds();
      const currentRowIndex = ids.findIndex((value) => value[0] === id);
      if (currentRowIndex >= 0) {
        await deleteRows(api, {
          spreadsheetId: this.spreadsheet,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 1327890270,
                    dimension: 'ROWS',
                    startIndex: currentRowIndex,
                    endIndex: currentRowIndex + 1,
                  },
                },
              },
            ],
          },
        });
      } else {
        throw new Error('Не найден расход с таким id');
      }
    } else {
      await deleteRows(api, {
        spreadsheetId: this.spreadsheet,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 1327890270,
                  dimension: 'ROWS',
                  startIndex: 0,
                },
              },
            },
          ],
        },
      });
    }
  };
}

export const expensesGApiController = new ExpensesGApiController();
