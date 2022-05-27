const getAppendRequest = ({ sheet, range, values }) => ({
  spreadsheetId: sheet,
  range,
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: [values]
  }
});

module.exports = getAppendRequest;
