const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");
const { v4: uuidv4 } = require('uuid');
const transformRowsInArray = require("./utils/transform-rows-in-array");

class GoogleApi {
  constructor() {
    this.spreadsheet = "19SzDsUOYi8rii9hE-rsGKN7ri-Qnb_70NBGMIgSwDu0";

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

    return data.values;
  };

  getCheckListData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: "checkList" });

    return data.values;
  };

  getContractorsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: "contractors" });

    return data.values;
  };

  getContractorsInfo = async (id) => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: id });

    return data.values;
  };

  getInstructionsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'instructions' });

    return data.values;
  };

  getAllowedAmounts = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'allowed-amounts-bar' });

    return data.values;
  };

  getBanquetOptions = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'banquet-options' });

    return data.values;
  };

  getDailyReports = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'dailyReports' });

    return data.values;
  };

  getExpenses = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({ spreadsheetId: this.spreadsheet, range: 'expenses' });

    return transformRowsInArray(data.values);
  };

  addReport = async ({ date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, expenses }) => {
    const api = await this.apiClient;

    const id = uuidv4();

    const request = {
      spreadsheetId: this.spreadsheet,
      range: 'dailyReports',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, JSON.stringify(expenses)]
        ]
      }
    };

    const { data } = await api.values.append(request);


    const getExpenses = await this.getExpenses();

    if (getExpenses.length) {
      const batchUpdateRequest = {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 1327890270,
              dimension: "ROWS",
              startIndex: 1
            }
          }
        }]
      }

      const batchRequest = {
        spreadsheetId: this.spreadsheet,
        resource: batchUpdateRequest
      };

      await api.batchUpdate(batchRequest);
    }

    return data;
  };

  updateReport = async ({ id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, expenses }) => {
    const api = await this.apiClient;

    const { data: ids } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'dailyReports!A:A'
    });

    let currentRowIndex = '';
    ids.values.forEach((value, index) => {
      if (value[0] === id) {
        currentRowIndex = index + 1;
      }
    });

    let result;

    if (currentRowIndex) {
      const request = {
        spreadsheetId: this.spreadsheet,
        range: `dailyReports!A${currentRowIndex}:I${currentRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            [id, date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, JSON.stringify(expenses)]
          ]
        }
      };

      const { data } = await api.values.update(request);
      result = data;
    }

    return result;
  };

  addExpense = async ({ id, sum, comment, category }) => {
    const api = await this.apiClient;

    const request = {
      spreadsheetId: this.spreadsheet,
      range: 'expenses',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [id, sum, comment, JSON.stringify(category)]
        ]
      }
    };

    const { data } = await api.values.append(request);

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
      const batchUpdateRequest = {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 1327890270,
              dimension: "ROWS",
              startIndex: currentRowIndex,
              endIndex: currentRowIndex + 1
            }
          }
        }]
      }

      const request = {
        spreadsheetId: this.spreadsheet,
        resource: batchUpdateRequest
      };

      const { data } = await api.batchUpdate(request);
      result = data;
    }


    return result;
  };
}

module.exports = new GoogleApi();
