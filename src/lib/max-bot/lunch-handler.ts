import moment from 'moment';
import { ReplyKeyboardMarkup } from 'node-telegram-bot-api';

const images = [
  'RRF/a+25MDjppMsrYcf6Gw4nDH7+we0Cs9qRIJJwnFIKXCKJjVabjvWwt+H5I0+VZo6CuhBmcYm2QAwEXfuosroom8nNSsO5YiMz57eNi3Tfm4vGi6+nETU2escO8ff0', // куриный, базук 4
  'qPJJ0AhnPrNK4B2EcXxbsEmxehEboRvLdBCrHpXvD0sLJih6RDtY1UV8sW6cP7ms84e6BbFMtSbEULsAk4ZmWrzrZcnZ4aYIiDm9wn4g6YlejS2a13aXFBifNa6wuFjA', // по корейски, греческий 1
  'oLx7pxXAqbg+l+yW5I8haHiaPQBAsfPP9cQQ1OsXy7qL4mZe7U0XNVQc4IUxQDvYj46V0XHfnInz/NBI3Gl8wPkRCWWCyHyer9zk1gRgCMmK7b/iBuRp0gVO6TNYU6BR', // армения, оливье 2
  'F4ac7w5am1CANRGL94HSSxwZ0xBQa9zOOQshWI55igPs9sykj7yp2LXTEoMmJe2c/2DBs+cWGsHdcxdgGqA8qU0bettaQ9TN8S0r4ulVRyQUs7FFJRCc4mvQ01s1fwlb', // блинный, винегрет 3
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
