const GoogleApi = require("../google-api");
const transformRowsInArray = require("../utils/transform-rows-in-array");

const { appendRow, deleteRows } = require("../utils/tableTransformMethods");

class ExpensesGApiController extends GoogleApi {
  getExpenses = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "expenses",
    });

    return transformRowsInArray(data.values);
  };

  getExpenseIds = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "expenses!A:A",
    });

    return data.values;
  };

  addExpense = async ({ id, sum, comment, category, counterparty }) => {
    const api = await this.apiClient;

    await appendRow(api, {
      sheet: this.spreadsheet,
      range: "expenses",
      values: [id, sum, comment, JSON.stringify(category), counterparty],
    });
  };

  deleteExpense = async (id) => {
    const api = await this.apiClient;

    if (id) {
      const ids = await this.getExpenseIds();
      const currentRowIndex = ids.findIndex((value) => value[0] === id);
      if (currentRowIndex >= 0) {
        await deleteRows(api, {
          sheet: this.spreadsheet,
          sheetId: 1327890270,
          startIndex: currentRowIndex,
          endIndex: currentRowIndex + 1,
        });
      } else {
        throw new Error("Не найден расход с таким id");
      }
    } else {
      await deleteRows(api, { sheet: this.spreadsheet, sheetId: 1327890270 });
    }
  };
}

module.exports = new ExpensesGApiController();
