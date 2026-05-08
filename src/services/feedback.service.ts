import * as feedbackRepository from '../repositories/feedback.repository';

import {
  feedbackGApiController,
  createImageFromHtml,
  TemplateTypes,
  maxBot,
  getTMaxBotChatId,
} from '../lib';

const transformFeedback = (data: any[]) =>
  data.map((item) => ({
    id: item._id,
    title: item.title,
    subtitle: item.subtitle,
    type: item.type,
    options: item.options,
    required: item.required,
  }));

export async function getRequestsList() {
  const feedback = await feedbackRepository.findAll();
  return transformFeedback(feedback);
}

export async function updateRequestsList(requests: any[]) {
  await feedbackRepository.replaceAll(requests);
  const feedback = await feedbackRepository.findAll();
  return transformFeedback(feedback);
}

export async function sendFeedback(body: any[]) {
  const transformedBody = body.map((item) => {
    if (Array.isArray(item.response)) {
      const newResponse = item.response.map((resp: any, index: number) => ({
        value: resp,
        label: item.options[index],
      }));

      return { ...item, response: newResponse, hasSubOptions: true };
    }

    return item;
  });

  await feedbackGApiController.sendFeedback(transformedBody);
  const image = (await createImageFromHtml(
    { data: transformedBody },
    TemplateTypes.FEEDBACK
  )) as string | Buffer;

  await maxBot.sendPhoto(getTMaxBotChatId('feedback'), image);
}
