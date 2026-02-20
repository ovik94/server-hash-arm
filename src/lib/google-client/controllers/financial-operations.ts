import { GoogleApi } from '../google-api';
import { appendRow, updateRow, deleteRows } from '../utils';

export class FinancialOperationsGApiController extends GoogleApi {
  static addFinancialOperation = async (values: (string | number | undefined)[]): Promise<void> => {
    const api = await this.prototype.apiClient;
    const spreadsheetId = this.prototype.getSpreadsheetId();

    await appendRow(api, {
      spreadsheetId,
      range: 'Учет финансов',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });
  };

  getFinancialOperations = async (): Promise<string[][]> => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.getSpreadsheetId(),
      range: 'Учет финансов!A:G',
    });

    return data.values;
  };

  addFinancialOperation = async (values: (string | number | undefined)[]): Promise<void> => {
    const api = await this.apiClient;

    await appendRow(api, {
      spreadsheetId: this.getSpreadsheetId(),
      range: 'Учет финансов',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });
  };

  updateFinancialOperation = async (
    id: string | undefined,
    values: (string | number | undefined)[],
    financeOperations: string[][]
  ): Promise<void> => {
    const api = await this.apiClient;
    const date = values[0];
    const title = values[1];
    const comment = values[5];

    const currentFinanceRowIndex =
      financeOperations.findIndex((row) => {
        let result;
        if (id) {
          result = row[0] === id;
        } else {
          result = row[1] === date && row[2] === title && row[6] === comment;
        }
        return result;
      }) + 1;
    if (currentFinanceRowIndex) {
      await updateRow(api, {
        spreadsheetId: this.getSpreadsheetId(),
        range: `Учет финансов!B${currentFinanceRowIndex}:G${currentFinanceRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
    }
  };

  deleteFinancialOperation = async (id: string): Promise<void> => {
    const api = await this.apiClient;

    const ids = await this.getFinancialOperations();

    const currentFinanceRowIndex = ids.findIndex((row) => row[0] === id);
    if (currentFinanceRowIndex >= 0) {
      await deleteRows(api, {
        spreadsheetId: this.getSpreadsheetId(),
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: currentFinanceRowIndex,
                  endIndex: currentFinanceRowIndex + 1,
                },
              },
            },
          ],
        },
      });
    }
  };
}

export const financialOperationsGApiController = new FinancialOperationsGApiController();
