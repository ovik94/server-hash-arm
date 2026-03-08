import * as giftCardsRepository from '../repositories/gift-cards.repository';
import { format } from 'date-fns';
import {
  getTelegramChatId,
  createImageFromHtml,
  tbot,
  TemplateTypes,
} from '../lib';

export async function getList(nominal?: string) {
  return giftCardsRepository.findByNominal(nominal);
}

export async function add(payload: {
  count: number;
  start: number;
  nominal: number;
}) {
  const { count, start, nominal } = payload;

  const values = Array.from({ length: count }, (_, i) => {
    const code = Math.floor(Math.random() * 100000);
    return {
      value: nominal,
      number: start + i,
      status: 'NOT_ACTIVATED',
      code,
    };
  });

  return giftCardsRepository.insertMany(values);
}

export async function activate(number: number | string) {
  await giftCardsRepository.updateStatusToActivated(
    number,
    format(new Date(), 'dd.MM.yyyy')
  );

  return giftCardsRepository.findByNumber(number);
}

export async function sendImage(number: number | string) {
  const card = await giftCardsRepository.findByNumber(number);
  if (!card) {
    throw new Error('Gift card not found');
  }

  if (card.status === 'NOT_ACTIVATED') {
    const error: any = new Error('Подарочная карта не активирована');
    error.code = 'NOT_ACTIVATED';
    throw error;
  }

  const image = (await createImageFromHtml(
    { number, nominal: card.value, code: card.code },
    TemplateTypes.GIFT_CARDS,
    { selector: '.root' }
  )) as string | Buffer;

  await tbot.sendPhoto(
    getTelegramChatId('giftCards'),
    image,
    {},
    {
      contentType: 'image/jpeg',
    }
  );

  return image;
}
