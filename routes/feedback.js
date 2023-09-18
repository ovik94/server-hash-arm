const router = require("express").Router();
const gApi = require("../google-client/google-api");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");
const { createImageFromHtml } = require("../create-image-from-html/create-image-from-html");

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
    const transformedBody = body.map(item => {
      if (Array.isArray(item.response)) {
       const newResponse = item.response.map((resp,index) => ({ value: resp, label: item.options[index] }));

       return { ...item, response: newResponse, hasSubOptions: true };
      }

      return item;
    });

    await gApi.sendFeedback(transformedBody);
    const image = await createImageFromHtml({ data: transformedBody }, 'FEEDBACK');

    await tbot.sendPhoto(getTelegramChatId("feedback"), image, undefined, { contentType: 'image/jpeg' });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
});

module.exports = router;
