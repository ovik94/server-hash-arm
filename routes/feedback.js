const router = require("express").Router();
const gApi = require("../google-client/google-api");

router.get("/list", async function (req, res, next) {
  const feedbackList = await gApi.getFeedbackList();

  const transformedList = feedbackList.map(item => ({
    ...item,
      options: item.options ? item.options.split(';') : undefined
  }));

  return res.json({ status: "OK", data: transformedList });
});

router.post("/send", async function (req, res, next) {
  const { body } = req;

  try {
    await gApi.sendFeedback(body);
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
});

module.exports = router;
