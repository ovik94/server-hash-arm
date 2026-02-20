import { getAppendRequest, AppendRequest } from './get-append-request';
import { getDeleteBatchRequest, DeleteBatchRequest } from './get-delete-batch-request';

export interface TableTransformApi {
  values: {
    append: (options: AppendRequest) => Promise<unknown>;
    update: (options: AppendRequest) => Promise<unknown>;
    get: (options: { spreadsheetId: string; range: string }) => Promise<{ data: { values: string[][] } }>;
  };
  batchUpdate: (options: DeleteBatchRequest) => Promise<unknown>;
}

export const appendRow = async (api: unknown, options: AppendRequest): Promise<void> => {
  const tableApi = api as TableTransformApi;
  await tableApi.values.append(options);
};

export const updateRow = async (api: unknown, options: AppendRequest): Promise<void> => {
  const tableApi = api as TableTransformApi;
  await tableApi.values.update(options);
};

export const deleteRows = async (api: unknown, options: DeleteBatchRequest): Promise<void> => {
  const tableApi = api as TableTransformApi;
  await tableApi.batchUpdate(options);
};
