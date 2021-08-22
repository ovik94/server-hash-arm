const TelegramBot = require('node-telegram-bot-api');

class TBot {
  constructor() {
    this.botToken = '1097913088:AAHQdx2MFTyT7ALFF2vLbWn9UVUVe0uQVvQ';

    this.bot = this.createBot();

    // this.bot.on('message', (msg) => {
      // const chatId = msg.chat.id;
    // });
  }

  createBot = () => new TelegramBot(this.botToken, { polling: true });

  sendMessage = async (chatId, message) => this.bot.sendMessage(chatId, message).then((response) => response);
}

module.exports = new TBot();
