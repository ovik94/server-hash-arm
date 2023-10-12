const gApi = require("../src/google-client/google-api");

async function getInstructions (req, res) {
  const data = await gApi.getInstructionsData();

  return res.json({ status: "OK", data });
}

module.exports = { getInstructions };
