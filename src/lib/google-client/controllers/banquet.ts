import { GoogleApi } from '../google-api';
import { transformKeyValue } from '../utils';

export class BanquetGApiController extends GoogleApi {
  getBanquetOptions = async (): Promise<
    Record<string, Record<string, string | number> | string | number>
  > => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.spreadsheet,
      range: 'banquet-options',
    });

    return transformKeyValue(data.values, 'number');
  };
}

export const banquetGApiController = new BanquetGApiController();
