const appendRequest = require("./get-append-request");
const getDeleteBatchRequest = require("./get-delete-batch-request");

const appendRow = async (api, options) => {
  await api.values.append(appendRequest(options));
};

const updateRow = async (api, options) => {
  await api.values.update(appendRequest(options));
};

const deleteRows = async (api, options) => {
  await api.batchUpdate(getDeleteBatchRequest(options));
};


module.exports = {
  appendRow,
  updateRow,
  deleteRows
};
