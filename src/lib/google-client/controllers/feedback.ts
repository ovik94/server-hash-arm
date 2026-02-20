import { GoogleApi } from '../google-api';
import { appendRow } from '../utils';

interface FeedbackRequest {
  title: string;
  hasSubOptions: boolean;
  response: string | { label: string; value: string }[];
}

export class FeedbackGApiController extends GoogleApi {
  sendFeedback = async (data: FeedbackRequest[]): Promise<void> => {
    const api = await this.apiClient;
    const values: (string | number | boolean | undefined)[] = [];
    const feedbackResponses = await api.values.get({
      spreadsheetId: this.feedbackSpreadsheet,
      range: 'feedbackResponses',
    });
    const columnsValues = await feedbackResponses.data.values[0];

    for (const requestData of data) {
      if (!requestData.hasSubOptions) {
        const index = columnsValues.findIndex(
          (item) => item === requestData.title
        );
        values[index] = requestData.response as string;
      } else {
        (requestData.response as { label: string; value: string }[]).forEach((option) => {
          const columnIndex = columnsValues.findIndex(
            (item) => item === option.label
          );
          values[columnIndex] = option.value;
        });
      }
    }

    await appendRow(api, {
      spreadsheetId: this.feedbackSpreadsheet,
      range: 'feedbackResponses',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });
  };
}

export const feedbackGApiController = new FeedbackGApiController();
