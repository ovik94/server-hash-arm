import moment from 'moment';
import { ReplyKeyboardMarkup } from 'node-telegram-bot-api';

const images = [
  'AgACAgIAAxkBAAIFuWklHuRpl9HMuaLK6M5BGXjZguHcAAIVC2sbrQMxSec1HxL-mJ8VAQADAgADeAADNgQ', // куриный, базук 4
  'AgACAgIAAxkBAAIFumklHxFrIa-YE5hLCdZW1JhE9IdbAAIWC2sbrQMxSfF-2OitDe4mAQADAgADeAADNgQ', // по корейски, греческий 1
  'AgACAgIAAxkBAAIFvGklHzX4wfLL9Jg2_V_G8ZaYmMAIAAIYC2sbrQMxSdtDntclh6bdAQADAgADeAADNgQ', // армения, оливье 2
  'AgACAgIAAxkBAAIFu2klHyLfVALUkJxp5pSW9GrKFbuSAAIXC2sbrQMxSYBcm5JOi37eAQADAgADeAADNgQ', // блинный, винегрет 3
];

const getWeekNumberForDate = (date: moment.Moment) => {
  const week = date.isoWeek();
  const weekNumber = week % 4 === 3 ? 0 : (week % 4) + 1;
  return weekNumber;
};

export interface BotMethods {
  sendMessage: (
    chatId: number,
    message: string,
    options?: object
  ) => Promise<any>;
  sendPhoto: (
    chatId: number,
    fileId: string,
    options: object,
    fileOptions?: object
  ) => Promise<any>;
}

export interface LunchMessage {
  chatId: number;
  text: string;
  chatType: string;
}

class LunchHandler {
  private waitingForDate: Map<number, boolean> = new Map();

  getLunchKeyboard(): ReplyKeyboardMarkup {
    return {
      keyboard: [
        [{ text: 'Эта неделя' }, { text: 'Следующая неделя' }],
        [{ text: 'Ввести дату начала недели' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    };
  }

  async handleMessage(
    msg: LunchMessage,
    botMethods: BotMethods
  ): Promise<boolean> {
    const { chatId, text, chatType } = msg;

    if (chatType === 'private') return false;

    if (this.waitingForDate.get(chatId)) {
      this.waitingForDate.delete(chatId);
      await this.handleDateInput(chatId, text, botMethods);
      return true;
    }

    if (text?.startsWith('/lunch') || text?.match(/^\/lunch(@\w+)?/)) {
      await botMethods.sendMessage(chatId, 'Выберите неделю:', {
        reply_markup: this.getLunchKeyboard(),
      });
      return true;
    }

    if (text?.startsWith('Эта неделя')) {
      await this.handleWeekSelection(chatId, moment(), botMethods);
      return true;
    }

    if (text?.startsWith('Следующая неделя')) {
      await this.handleWeekSelection(
        chatId,
        moment().add(1, 'week'),
        botMethods
      );
      return true;
    }

    if (text === 'Ввести дату начала недели') {
      await botMethods.sendMessage(
        chatId,
        'Введите дату начала недели (например: 24.02.2026):'
      );
      this.waitingForDate.set(chatId, true);
      return true;
    }

    return false;
  }

  private async handleWeekSelection(
    chatId: number,
    date: moment.Moment,
    botMethods: BotMethods
  ) {
    await this.sendLunchMenu({
      chatId,
      date,
      botMethods,
      replyMarkup: { remove_keyboard: true },
    });
  }

  private async handleDateInput(
    chatId: number,
    dateStr: string,
    botMethods: BotMethods
  ) {
    const parsedDate = moment(
      dateStr,
      ['DD.MM.YYYY', 'D.M.YYYY', 'YYYY-MM-DD'],
      true
    );
    if (!parsedDate.isValid()) {
      await botMethods.sendMessage(
        chatId,
        'Неверный формат даты. Попробуйте /lunch'
      );
      return;
    }

    const monday = parsedDate.clone().isoWeekday(1);
    await this.handleWeekSelection(chatId, monday, botMethods);
  }

  async sendLunchMenu(params: {
    chatId: number;
    date: moment.Moment;
    botMethods: BotMethods;
    replyMarkup?: object;
  }) {
    const { chatId, date, botMethods, replyMarkup } = params;
    const weekNumber = getWeekNumberForDate(date);

    const imageFileId = images[weekNumber];

    await botMethods.sendPhoto(chatId, imageFileId, {
      caption: `Меню бизнес-ланча на ${date.format('DD.MM.YYYY')} (неделя ${weekNumber + 1}/4)`,
      reply_markup: replyMarkup,
    });
  }
}

export const lunchHandler = new LunchHandler();
