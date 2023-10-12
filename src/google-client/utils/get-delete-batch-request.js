const getDeleteBatchRequest = ({ sheet, sheetId, startIndex = 1, endIndex = undefined }) => {
  const batchUpdateRequest = {
    requests: [{
      deleteDimension: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex,
          endIndex
        }
      }
    }]
  }

  return {
    spreadsheetId: sheet,
    resource: batchUpdateRequest
  };
};

module.exports = getDeleteBatchRequest;
