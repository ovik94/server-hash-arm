import TelegramBot from "node-telegram-bot-api";
import { lunchHandler } from "./lunch-handler";

interface MessageHandler {
  handleMessage(msg: { chatId: number; text: string; chatType: string }, botMethods: {
    sendMessage: (chatId: number, message: string, options?: object) => Promise<any>;
    sendPhoto: (chatId: number, photo: string | Buffer, options: object, fileOptions?: object) => Promise<any>;
  }): Promise<boolean>;
}

const handlers: MessageHandler[] = [lunchHandler];

class TBot {
  private botToken: string;
  private bot: TelegramBot;

  constructor() {
    this.botToken = process.env.TG_BOT_TOKEN;
    this.bot = this.createBot();
    this.bot.on("polling_error", (err) => console.log(err.message));

    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      const chatType = msg.chat.type;
      
      const botMethods = {
        sendMessage: this.sendMessage,
        sendPhoto: this.sendPhoto,
      };

      for (const handler of handlers) {
        const handled = await handler.handleMessage({ chatId, text, chatType }, botMethods);
        if (handled) return;
      }
    });

    const commands = [
      {
        command: "lunch",
        description: "Получить меню бизнес-ланча",
      },
    ];

    this.bot.setMyCommands(commands);
  }

  createBot = () => new TelegramBot(this.botToken, { polling: true });

  sendMessage = async (chatId: number, message: string, options?: object) =>
    this.bot.sendMessage(chatId, message, options).then((response) => response);

  sendPhoto = async (chatId: number, photo: string | Buffer, options: object, fileOptions?: object) =>
    this.bot.sendPhoto(chatId, photo, options, fileOptions).then((response) => response);

  sendDocument = async (chatId: number, data: any, options?: object, docOptions?: object) =>
    this.bot.sendDocument(chatId, data, options, docOptions).then((response) => response);

  getChat = async (chatName: string) =>
    this.bot.getChat(chatName).then((response) => response);
}

export default new TBot();
