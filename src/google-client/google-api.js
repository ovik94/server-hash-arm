const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");

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
}

module.exports = GoogleApi;
