const { isAfter, isBefore } = require("date-fns");
const GoogleApi = require("../google-api");
const transformRowsInArray = require("../utils/transform-rows-in-array");
const transformDate = require("./utils/transform-date");
const {
  appendRow,
  deleteRows,
  updateRow,
} = require("../utils/tableTransformMethods");

class DailyReportsGApiController extends GoogleApi {
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
        return isAfter(transformDate(item.date), transformDate(from));
      });
    }

    if (to) {
      result = result.filter((item) => {
        if (item.date === to) {
          return true;
        }
        return isBefore(transformDate(item.date), transformDate(to));
      });
    }

    return result;
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
}

module.exports = new DailyReportsGApiController();
