const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");
const { v4: uuidv4 } = require('uuid');
const transformRowsInArray = require("./utils/transform-rows-in-array");
const transformColumnsInArray = require("./utils/transform-columns-in-array");
const transformKeyValue = require("./utils/transform-key-value");
const appendRequest = require("./utils/get-append-request");
const getDeleteBatchRequest = require("./utils/get-delete-batch-request");

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

  addReport = async ({ date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, expenses }) => {
    const api = await this.apiClient;

    const id = uuidv4();

    const { data } = await api.values.append(appendRequest({
      sheet: this.spreadsheet,
      range: 'dailyReports',
      values: [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, JSON.stringify(expenses)]
    }));

    const getExpenses = await this.getExpenses();

    if (getExpenses.length) {
      await api.batchUpdate(getDeleteBatchRequest({
        sheet: this.spreadsheet,
        sheetId: 1327890270
      }));
    }

    for (const expense of expenses) {
      await api.values.append(appendRequest({
        sheet: this.financialSpreadsheet,
        range: 'Учет финансов',
        values: [expense.id, date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment || '']
      }));
    }

    return data;
  };

  updateReport = async ({ id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, expenses }) => {
    const api = await this.apiClient;

    const { data: ids } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'dailyReports!A:I'
    });

    let currentRowIndex = '';
    let oldExpenses = [];

    ids.values.forEach((value, index) => {
      if (value[0] === id) {
        currentRowIndex = index + 1;
        oldExpenses = JSON.parse(value[8]);
      }
    });

    let result;

    if (currentRowIndex) {
      const { data } = await api.values.update(appendRequest({
        sheet: this.spreadsheet,
        range: `dailyReports!A${currentRowIndex}:I${currentRowIndex}`,
        values: [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, JSON.stringify(expenses)]
      }));

      result = data;
    }

    const idsToDelete = [];
    oldExpenses.forEach(i => {
      if (!expenses.find(expense => expense.id === i.id)) {
        idsToDelete.push(i.id);
      }
    });

    const { data: idsFinancial } = await api.values.get({
      spreadsheetId: this.financialSpreadsheet,
      range: 'Учет финансов!A:A'
    });

    for (const expense of expenses) {
      if (oldExpenses.find(exp => exp.id === expense.id)) {
        const currentFinanceRowIndex = idsFinancial.values.findIndex(row => row[0] === expense.id) + 1;

        if (currentFinanceRowIndex) {
          await api.values.update(appendRequest({
            sheet: this.financialSpreadsheet,
            range: `Учет финансов!B${currentFinanceRowIndex}:G${currentFinanceRowIndex}`,
            values: [date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment || '']
          }));
        }
      } else {
        await api.values.append(appendRequest({
          sheet: this.financialSpreadsheet,
          range: 'Учет финансов',
          values: [expense.id, date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment || '']
        }));
      }
    }

    if (idsToDelete.length) {
      for (const id of idsToDelete) {
        const index = idsFinancial.values.findIndex(row => row[0] === id);

        if (index >= 0) {
          await api.batchUpdate(getDeleteBatchRequest({
            sheet: this.financialSpreadsheet,
            sheetId: 0,
            startIndex: index,
            endIndex: index + 1
          }));
        }
      }
    }

    return result;
  };

  addExpense = async ({ id, sum, comment, category, counterparty }) => {
    const api = await this.apiClient;

    const { data } = await api.values.append(appendRequest({
      sheet: this.spreadsheet,
      range: 'expenses',
      values: [id, sum, comment, JSON.stringify(category), counterparty]
    }));

    return data;
  };

  deleteExpense = async (id) => {
    const api = await this.apiClient;

    const { data: ids } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'expenses!A:A'
    });

    let currentRowIndex = null;
    ids.values.forEach((value, index) => {
      if (value[0] === id) {
        currentRowIndex = index;
      }
    });

    let result;
    if (currentRowIndex) {
      const { data } = await api.batchUpdate(getDeleteBatchRequest({
        sheet: this.spreadsheet,
        sheetId: 1327890270,
        startIndex: currentRowIndex,
        endIndex: currentRowIndex + 1
      }));

      result = data;
    }

    return result;
  };
}

module.exports = new GoogleApi();
