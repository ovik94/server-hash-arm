const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");
const transformRowsInArray = require("./utils/transform-rows-in-array");
const transformColumnsInArray = require("./utils/transform-columns-in-array");
const transformKeyValue = require("./utils/transform-key-value");
const appendRequest = require("./utils/get-append-request");
const { appendRow, deleteRows, updateRow } = require('./utils/tableTransformMethods');

class GoogleApi {
  constructor() {
    this.spreadsheet = "19SzDsUOYi8rii9hE-rsGKN7ri-Qnb_70NBGMIgSwDu0";
    this.financialSpreadsheet = "1gzaOkbhiYrqfPnAtnVULoLIAR79YygFP3XqRNdFHR4M";
    this.apiClient = this.getApiClient();
  }

  getApiClient = async () => {
    const authClient = await getAuthClient();
    const { spreadsheets: apiClient } = google.sheets({
      version: "v4",
      auth: authClient,
    });

    return apiClient;
  };

  getUserData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: "user" });

    return transformRowsInArray(data.values);
  };

  getCheckListData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: "checkList" });

    return transformColumnsInArray(data.values);
  };

  getContractorsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: "contractors" });

    return transformRowsInArray(data.values);
  };

  getContractorsInfo = async (id) => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: id });

    return transformRowsInArray(data.values);
  };

  getInstructionsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'instructions' });

    return transformRowsInArray(data.values);
  };

  getAllowedAmounts = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'allowed-amounts-bar' });

    return transformRowsInArray(data.values);
  };

  getBanquetOptions = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'banquet-options' });

    return transformKeyValue(data.values, 'number');
  };

  getDailyReports = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'dailyReports' });

    return transformRowsInArray(data.values);
  };

  getExpenses = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'expenses' });

    return transformRowsInArray(data.values);
  };

  getCounterparties = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'counterparties' });

    return transformRowsInArray(data.values);
  };

  getExpenseIds = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'expenses!A:A' });

    return data.values;
  }

  getFinancialOperations = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.financialSpreadsheet, range: 'Учет финансов!A:G' });

    return data.values;
  }

  addReport = async (data) => {
    const { id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, expenses } = data;
    const api = await this.apiClient;

    await appendRow(api, {
      sheet: this.spreadsheet,
      range: 'dailyReports',
      values: [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, JSON.stringify(expenses)]
    });
  };

  addFinancialOperation = async (values) => {
    const api = await this.apiClient;
    await appendRow(api, { sheet: this.financialSpreadsheet, range: 'Учет финансов', values })
  };

  updateFinancialOperation = async (id, values, financeOperations) => {
    const api = await this.apiClient;
    const date = values[0];
    const title = values[1];
    const comment = values[5];

    const currentFinanceRowIndex = financeOperations.findIndex(row => {
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
        sheet: this.financialSpreadsheet,
        range: `Учет финансов!B${currentFinanceRowIndex}:G${currentFinanceRowIndex}`,
        values
      })
    }
  }

  deleteFinancialOperation = async (id) => {
    const api = await this.apiClient;

    const ids = await this.getFinancialOperations();

    const currentFinanceRowIndex = ids.findIndex(row => row[0] === id);
    if (currentFinanceRowIndex >= 0) {
      await deleteRows(api, {
        sheet: this.financialSpreadsheet,
        sheetId: 0,
        startIndex: currentFinanceRowIndex,
        endIndex: currentFinanceRowIndex + 1
      });
    }
  }

  updateReport = async (data) => {
    const { id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, expenses } = data;
    const api = await this.apiClient;

    const reports = await this.getDailyReports();
    const reportRowIndex = reports.findIndex(item => item.id === id) + 2;

    if (reportRowIndex) {
      await updateRow(api, {
        sheet: this.spreadsheet,
        range: `dailyReports!A${reportRowIndex}:J${reportRowIndex}`,
        values: [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, JSON.stringify(expenses)]
      });
    }
  };

  clearReport = async () => {
    const api = await this.apiClient;
    const reports = await this.getDailyReports()

    await deleteRows(api, {
      sheet: this.spreadsheet,
      sheetId: 877273327,
      startIndex: 1,
      endIndex: reports.length - 30
    });
  }

  addExpense = async ({ id, sum, comment, category, counterparty }) => {
    const api = await this.apiClient;

    await appendRow(api, {
      sheet: this.spreadsheet,
      range: 'expenses',
      values: [id, sum, comment, JSON.stringify(category), counterparty]
    });
  };

  deleteExpense = async (id) => {
    const api = await this.apiClient;

    if (id) {
      const ids = await this.getExpenseIds()
      const currentRowIndex = ids.findIndex((value) => value[0] === id);
      if (currentRowIndex >= 0) {
        await deleteRows(api, {
          sheet: this.spreadsheet,
          sheetId: 1327890270,
          startIndex: currentRowIndex,
          endIndex: currentRowIndex + 1
        });
      } else {
        throw new Error('Не найден расход с таким id');
      }
    } else {
      await deleteRows(api, { sheet: this.spreadsheet, sheetId: 1327890270 });
    }
  };
}

module.exports = new GoogleApi();
