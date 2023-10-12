const gApi = require("../src/google-client/google-api");

async function getUserList (req, res) {
  const userData = await gApi.getUserData();

  return res.json({ status: "OK", data: userData });
}

module.exports = { getUserList };
