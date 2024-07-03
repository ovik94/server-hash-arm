const GoogleApi = require("../google-api");
const { appendRow } = require("../utils/tableTransformMethods");

class FeedbackGApiController extends GoogleApi {
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
}

module.exports = new FeedbackGApiController();
