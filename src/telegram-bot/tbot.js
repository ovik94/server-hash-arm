const TelegramBot = require("node-telegram-bot-api");

class TBot {
  constructor() {
    this.botToken = "1097913088:AAHQdx2MFTyT7ALFF2vLbWn9UVUVe0uQVvQ";

    this.bot = this.createBot();

    // this.bot.on("message", (msg) => {
    //   const chatId = msg.chat.id;
    //   console.log(msg, "msg", chatId);
    // });

    this.bot.on("polling_error", (err) => console.log(err.data));

    const commands = [
      // {
      //   command: "start",
      //   description: "Запуск бота",
      // },
      // {
      //   command: "ref",
      //   description: "Получить реферальную ссылку",
      // },
      // {
      //   command: "help",
      //   description: "Раздел помощи",
      // },
    ];

    this.bot.setMyCommands(commands);
  }

  createBot = () => new TelegramBot(this.botToken, { polling: true });

  sendMessage = async (chatId, message, options) =>
    this.bot.sendMessage(chatId, message, options).then((response) => response);

  sendPhoto = async (chatId, fileId, options, fileOptions) =>
    this.bot.sendPhoto(chatId, fileId, options, fileOptions).then((response) => response);

  sendDocument = async (chatId, data, options, docOptions) =>
    this.bot.sendDocument(chatId, data, options, docOptions).then((response) => response);

  getChat = async (chatName) =>
    this.bot.getChat(chatName).then((response) => response);
}

module.exports = new TBot();
