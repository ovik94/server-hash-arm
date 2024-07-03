const GoogleApi = require("../google-api");
const transformKeyValue = require("../utils/transform-key-value");

class BanquetGApiController extends GoogleApi {
  getBanquetOptions = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: "banquet-options",
    });

    return transformKeyValue(data.values, "number");
  };
}

module.exports = new BanquetGApiController();
