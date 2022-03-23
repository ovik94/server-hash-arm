const TelegramBot = require('node-telegram-bot-api');

class TBot {
  constructor() {
    this.botToken = '1097913088:AAHQdx2MFTyT7ALFF2vLbWn9UVUVe0uQVvQ';

    this.bot = this.createBot();

    // this.bot.on('message', (msg) => {
    //   const chatId = msg.chat.id;
    //   console.log(msg, 'msg');
    // });
  }

  createBot = () => new TelegramBot(this.botToken, { polling: true });

  sendMessage = async (chatId, message, options) => this.bot.sendMessage(chatId, message, options).then((response) => response);

  sendPhoto = async (chatId, fileId, options) => this.bot.sendPhoto(chatId, fileId, options).then((response) => response);

  sendDocument = async (chatId, data, options, docOptions) => this.bot.sendDocument(chatId, data, options, docOptions).then((response) => response);

  getChat = async (chatName) => this.bot.getChat(chatName).then((response) => response);
}

module.exports = new TBot();
