const gApi = require("../src/google-client/google-api");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const FeedbackModel = require("../model/feedback");

const transformedFeedback = (data) => data.map(item => ({
    id: item._id,
    title: item.title,
    subtitle: item.subtitle,
    type: item.type,
    options: item.options,
    required: item.required
  })
);

async function getRequestsList(req, res) {
  let feedbackData;

  try {
    feedbackData = await FeedbackModel.find();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: transformedFeedback(feedbackData) });
}

async function updateRequestsList(req, res) {
  try {
    await FeedbackModel.deleteMany();
    await FeedbackModel.create(req.body.requests);
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const feedback = await FeedbackModel.find();

  return res.json({ status: "OK", data: transformedFeedback(feedback) });
}

async function sendFeedback(req, res) {
  const { body } = req;

  try {
    const transformedBody = body.map(item => {
      if (Array.isArray(item.response)) {
        const newResponse = item.response.map((resp, index) => ({ value: resp, label: item.options[index] }));

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

module.exports = { getRequestsList, sendFeedback, updateRequestsList };
