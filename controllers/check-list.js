const gApi = require("../src/google-client/google-api");

async function getCheckList (req, res) {
  const data = await gApi.getCheckListData();

  return res.json({ status: "OK", data });
}

module.exports = { getCheckList };
