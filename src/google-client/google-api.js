const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");
const transformRowsInArray = require("./utils/transform-rows-in-array");
const transformColumnsInArray = require("./utils/transform-columns-in-array");
const transformKeyValue = require("./utils/transform-key-value");
const {
  appendRow,
  deleteRows,
  updateRow,
} = require("./utils/tableTransformMethods");
const { isAfter, isBefore } = require("date-fns");

const transformedDate = (date) => {
  const dateArray = date.split(".");
  const day = Number(dateArray[0]) + 1;
  const month = Number(dateArray[1]) - 1;
  const year = Number(dateArray[2]);
  return new Date(year, month, day);
};

class GoogleApi {
  constructor() {
    this.spreadsheet = "19SzDsUOYi8rii9hE-rsGKN7ri-Qnb_70NBGMIgSwDu0"; // Hash-arm
    this.hashLavashSpreadsheet = "1gzaOkbhiYrqfPnAtnVULoLIAR79YygFP3XqRNdFHR4M"; // Учет финансов v2
    this.foodTrackSpreadsheet = "1m6cH_-JlIWUkmL8yBkpQ1ktDn3AO8lvIPDcHFmq-lHw"; // Учет финансов Фудтрак
    this.feedbackSpreadsheet = "1lhaOAZlRKhRq6fJNAqUNq7qOzbnW1ZfsYmdRelNa7PI";
    this.metricsSpreadsheet = "1Gzn-ydF43Vw5s15oS6aJm_FiovcatpQv8OjKd-e3AQA";
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

  getSpreadsheetId = () => {
    return this.hashLavashSpreadsheet;
  };

  getCheckListData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "checkList",
    });

    return transformColumnsInArray(data.values);
  };

  getContractorsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "contractors",
    });

    return transformRowsInArray(data.values);
  };

  getContractorsInfo = async (id) => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: id,
    });

    return transformRowsInArray(data.values);
  };

  getInstructionsData = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "instructions",
    });

    return transformRowsInArray(data.values);
  };

  getBanquetOptions = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "banquet-options",
    });

    return transformKeyValue(data.values, "number");
  };

  getDailyReports = async (from, to) => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "dailyReports",
    });
    const reports = transformRowsInArray(data.values);
    let result = reports.map((item) => ({
      ...item,
      expenses: item.expenses ? JSON.parse(item.expenses) : [],
    }));

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

  getExpenses = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "expenses",
    });

    return transformRowsInArray(data.values);
  };

  getCounterparties = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "counterparties",
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

  addReport = async (data) => {
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
    } = data;
    const api = await this.apiClient;

    await appendRow(api, {
      sheet: this.spreadsheet,
      range: "dailyReports",
      values: [
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
      ],
    });
  };

  updateReport = async (data) => {
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
    } = data;
    const api = await this.apiClient;

    const reports = await this.getDailyReports();
    const reportRowIndex = reports.findIndex((item) => item.id === id) + 2;

    if (reportRowIndex) {
      await updateRow(api, {
        sheet: this.spreadsheet,
        range: `dailyReports!A${reportRowIndex}:K${reportRowIndex}`,
        values: [
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
        ],
      });
    }
  };

  clearReport = async () => {
    const api = await this.apiClient;
    const reports = await this.getDailyReports();

    await deleteRows(api, {
      sheet: this.spreadsheet,
      sheetId: 877273327,
      startIndex: 1,
      endIndex: reports.length - 30,
    });
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

  getFinancialOperations = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.hashLavashSpreadsheet,
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
        sheet: this.hashLavashSpreadsheet,
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
        sheet: this.hashLavashSpreadsheet,
        sheetId: 0,
        startIndex: currentFinanceRowIndex,
        endIndex: currentFinanceRowIndex + 1,
      });
    }
  };

  sendFeedback = async (data) => {
    const api = await this.apiClient;
    const values = [];
    const feedbackResponses = await api.values.get({
      spreadsheetId: this.feedbackSpreadsheet,
      range: "feedbackResponses",
    });
    const columnsValues = await feedbackResponses.data.values[0];

    for (const requestData of data) {
      if (!requestData.hasSubOptions) {
        const index = columnsValues.findIndex(
          (item) => item === requestData.title
        );
        values[index] = requestData.response;
      } else {
        requestData.response.forEach((option) => {
          const columnIndex = columnsValues.findIndex(
            (item) => item === option.label
          );
          values[columnIndex] = option.value;
        });
      }
    }

    await appendRow(api, {
      sheet: this.feedbackSpreadsheet,
      range: "feedbackResponses",
      values,
    });
  };

  saveMetrics = async (data) => {
    const { date, lunch, delivery } = data;
    const api = await this.apiClient;
    const values = [date];
    const metricsTable = await api.values.get({
      spreadsheetId: this.metricsSpreadsheet,
      range: "metrics",
    });
    const metrics = transformRowsInArray(metricsTable.data.values);
    const columnsValues = await metricsTable.data.values[0];

    if (lunch && lunch.count) {
      values[1] = lunch.count;
      values[2] = lunch.sum;
    }

    const transformedDelivery = [];

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

    // const metricsRowIndex = metrics.findIndex((item) => item['Дата'] === date);

    // if (metricsRowIndex === -1) {
    await appendRow(api, {
      sheet: this.metricsSpreadsheet,
      range: "metrics",
      values,
    });
    // } else {
    //   await updateRow(api, {
    //     sheet: this.metricsSpreadsheet,
    //     range: `metrics!A${metricsRowIndex + 2}:S${metricsRowIndex + 2}`,
    //     values
    //   });
    // }
  };
}

module.exports = GoogleApi;
