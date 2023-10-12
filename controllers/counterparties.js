const gApi = require("../src/google-client/google-api");

async function getCounterparties (req, res, ) {
  let data = await gApi.getCounterparties();
  const { role } = req.query;
  let result = {};

  if (role) {
    result = data.filter(item => item.role === role);
  } else {
    data.forEach((item) => {
      if (result[item.role]) {
        result[item.role].push(item);
      } else {
        result[item.role] = [item];
      }
    })
  }

  return res.json({ status: "OK", data: result });
}

module.exports = { getCounterparties };
