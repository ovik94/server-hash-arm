const GoogleApi = require("../google-api");
const {
  appendRow,
  updateRow,
  deleteRows,
} = require("../utils/tableTransformMethods");

class FinancialOperationsGApiController extends GoogleApi {
  getFinancialOperations = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.getSpreadsheetId(),
      range: "Учет финансов!A:G",
    });

    return data.values;
  };

  addFinancialOperation = async (values) => {
    const api = await this.apiClient;

    await appendRow(api, {
      sheet: this.getSpreadsheetId(),
      range: "Учет финансов",
      values,
    });
  };

  updateFinancialOperation = async (id, values, financeOperations) => {
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
        sheet: this.getSpreadsheetId(),
        range: `Учет финансов!B${currentFinanceRowIndex}:G${currentFinanceRowIndex}`,
        values,
      });
    }
  };

  deleteFinancialOperation = async (id) => {
    const api = await this.apiClient;

    const ids = await this.getFinancialOperations();

    const currentFinanceRowIndex = ids.findIndex((row) => row[0] === id);
    if (currentFinanceRowIndex >= 0) {
      await deleteRows(api, {
        sheet: this.getSpreadsheetId(),
        sheetId: 0,
        startIndex: currentFinanceRowIndex,
        endIndex: currentFinanceRowIndex + 1,
      });
    }
  };
}

module.exports = new FinancialOperationsGApiController();
