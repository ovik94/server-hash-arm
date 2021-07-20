const { google } = require("googleapis");
const { getAuthClient } = require("./auth-client");

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

    console.log(data, 'data');
    return data.values;
  };
}

module.exports = new GoogleApi();
