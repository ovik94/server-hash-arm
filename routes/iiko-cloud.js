const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");
const iikoCloudApi = require("../iiko-cloud/api");

router.get("/access-token", async function (req, res, next) {
  try {
    const accessToken = await iikoCloudApi.getAccessToken(req.headers.token);
    return res.json({ status: "OK", data: { token: accessToken.token } });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
});


module.exports = router;