import { Bot, ImageAttachment } from '@maxhub/max-bot-api';
import type { SendMessageExtra } from '@maxhub/max-bot-api/dist/core/network/api';

class MaxBot {
  private botToken: string;
  private bot: Bot;

  constructor() {
    this.botToken = process.env.MAX_BOT_TOKEN;

    this.bot = new Bot(this.botToken);

    this.bot.on('message_created', async (ctx: any) => {
      const chat = await ctx.getChat();
      const text = ctx.message.body.text;
      console.log(ctx.message.body.attachments, 'ctx.message');
      console.log(`[MAX-bot]: New message from chat ${chat.chat_id}: ${text}`);
    });

    this.bot.start();
  }

  sendMessage = async (
    chatId: number,
    message: string,
    options: SendMessageExtra
  ) => {
    try {
      const result = await this.bot.api.sendMessageToChat(
        chatId,
        message,
        options
      );
      return result;
    } catch (error) {
      console.error('[MAX] Send message error:', error);
      throw error;
    }
  };

  sendPhoto = async (chatId: number, file: string | Buffer) => {
    try {
      let image: ImageAttachment;

      if (Buffer.isBuffer(file)) {
        const uploaded = await this.bot.api.uploadImage({
          source: file,
        });

        let token = uploaded.token;
        if (!token && uploaded.photos) {
          const photoKeys = Object.keys(uploaded.photos);
          if (photoKeys.length > 0) {
            token = uploaded.photos[photoKeys[0]].token;
          }
        }

        image = new ImageAttachment({ token });
      } else if (typeof file === 'string') {
        image = new ImageAttachment({ token: file });
      } else {
        throw new Error(
          '[MAX] sendPhoto: file must be Buffer or string (token)'
        );
      }

      return await this.bot.api.sendMessageToChat(chatId, '', {
        attachments: [image.toJson()],
      });
    } catch (error) {
      console.error('[MAX] Send photo error:', error);
      throw error;
    }
  };

  getChat = async (chatId: number) => {
    try {
      const result = await this.bot.api.getChat(chatId);
      return result;
    } catch (error) {
      console.error('[MAX-bot]: Get chat error:', error);
      throw error;
    }
  };
}

export default new MaxBot();
