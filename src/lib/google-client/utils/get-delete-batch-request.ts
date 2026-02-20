export interface DeleteBatchRequestOptions {
  sheet: string;
  sheetId: number;
  startIndex?: number;
  endIndex?: number;
}

export interface DeleteBatchRequest {
  spreadsheetId: string;
  resource: {
    requests: {
      deleteDimension: {
        range: {
          sheetId: number;
          dimension: string;
          startIndex: number;
          endIndex?: number;
        };
      };
    }[];
  };
}

export const getDeleteBatchRequest = ({
  sheet,
  sheetId,
  startIndex = 1,
  endIndex = undefined,
}: DeleteBatchRequestOptions): DeleteBatchRequest => {
  const batchUpdateRequest: DeleteBatchRequest['resource'] = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex,
            endIndex,
          },
        },
      },
    ],
  };

  return {
    spreadsheetId: sheet,
    resource: batchUpdateRequest,
  };
};
