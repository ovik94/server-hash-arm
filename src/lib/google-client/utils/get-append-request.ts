export interface AppendRequestOptions {
  sheet: string;
  range: string;
  values: (string | number | boolean | undefined)[];
}

export interface AppendRequest {
  spreadsheetId: string;
  range: string;
  valueInputOption: string;
  resource: {
    values: (string | number | boolean | undefined)[][];
  };
}

export const getAppendRequest = ({ sheet, range, values }: AppendRequestOptions): AppendRequest => ({
  spreadsheetId: sheet,
  range,
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: [values]
  }
});
