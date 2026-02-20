import { google } from 'googleapis';
import { getAuthClient } from './auth-client';
import { TableTransformApi } from './utils';

export class GoogleApi {
  spreadsheet = '19SzDsUOYi8rii9hE-rsGKN7ri-Qnb_70NBGMIgSwDu0';
  hashLavashSpreadsheet = '1gzaOkbhiYrqfPnAtnVULoLIAR79YygFP3XqRNdFHR4M';
  feedbackSpreadsheet = '1lhaOAZlRKhRq6fJNAqUNq7qOzbnW1ZfsYmdRelNa7PI';
  metricsSpreadsheet = '1Gzn-ydF43Vw5s15oS6aJm_FiovcatpQv8OjKd-e3AQA';
  apiClient: Promise<TableTransformApi>;

  constructor() {
    this.apiClient = this.getApiClient();
  }

  getApiClient = async (): Promise<TableTransformApi> => {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as string });

    return sheets as unknown as TableTransformApi;
  };

  getSpreadsheetId = (): string => {
    return this.hashLavashSpreadsheet;
  };
}
