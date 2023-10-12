const gApi = require("../src/google-client/google-api");

async function getFortuneList (req, res) {
  const fortuneList = await gApi.getFortune(req.query.type);

  return res.json({ status: "OK", data: fortuneList.map(item => ({ ...item, count: Number(item.count) })) });
}

async function reduce (req, res) {
  const { body } = req;

  try {
    await gApi.fortuneReduce(body);
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
}

module.exports = { getFortuneList, reduce };
