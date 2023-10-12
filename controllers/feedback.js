const gApi = require("../src/google-client/google-api");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

async function getList (req, res) {
  const feedbackList = await gApi.getFeedbackList();

  const transformedList = feedbackList.map(item => ({
    ...item,
    options: item.options ? item.options.split(';') : undefined
  }));

  return res.json({ status: "OK", data: transformedList });
}

async function sendFeedback (req, res) {
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
}

module.exports = { getList, sendFeedback };
