const { Bot, ImageAttachment, FileAttachment } = require("@maxhub/max-bot-api");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const FILES_PATH = path.resolve(__dirname, '../public', 'tmp');

class MaxBot {
  constructor() {
    this.botToken = process.env.MAX_BOT_TOKEN;

    this.bot = this.createBot();

    this.bot.start();
  }

  createBot = () => {
    const bot = new Bot(this.botToken);

    bot.on("message_created", async (ctx) => {
      const chat = await ctx.getChat();
      const text = ctx.message.body.text;
      console.log(ctx.message.body.attachments, 'ctx.message');
      console.log(`[MAX] New message from chat ${chat.chat_id}: ${text}`);
    });

    bot.on("polling_error", (err) => console.log("[MAX] Polling error:", err));

    return bot;
  };

  sendMessage = async (chatId, message, options) => {
    try {
      const result = await this.bot.api.sendMessageToChat(chatId, message, options);
      return result;
    } catch (error) {
      console.error("[MAX] Send message error:", error);
      throw error;
    }
  };

  sendPhoto = async (chatId, file, options) => {
    let tempFilePath = null;

    try {
      let image;

      if (Buffer.isBuffer(file)) {
        const ext = options?.contentType?.includes("png") ? ".png" : ".jpg";
        tempFilePath = `${FILES_PATH}/max-bot-${uuidv4()}${ext}`;
        
        if (!fs.existsSync(FILES_PATH)) {
          fs.mkdirSync(FILES_PATH, { recursive: true });
        }
        fs.writeFileSync(tempFilePath, file);

        const uploaded = await this.bot.api.uploadImage({ source: tempFilePath });
        
        let token = uploaded.token;
        if (!token && uploaded.photos) {
          const photoKeys = Object.keys(uploaded.photos);
          if (photoKeys.length > 0) {
            token = uploaded.photos[photoKeys[0]].token;
          }
        }
        
        image = new ImageAttachment({ token });
      } else if (typeof file === "string") {
        image = new ImageAttachment({ token: file });
      } else {
        throw new Error("[MAX] sendPhoto: file must be Buffer or string (token)");
      }

      return await this.bot.api.sendMessageToChat(chatId, "", {
        attachments: [image.toJson()],
      });
    } catch (error) {
      console.error("[MAX] Send photo error:", error);
      throw error;
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  };

  sendDocument = async (chatId, data, options) => {
    let tempFilePath = null;

    try {
      let file;

      if (Buffer.isBuffer(data)) {
        const ext = options?.contentType?.includes("pdf") ? ".pdf" : ".file";
        tempFilePath = `${FILES_PATH}/max-bot-${uuidv4()}${ext}`;
        
        if (!fs.existsSync(FILES_PATH)) {
          fs.mkdirSync(FILES_PATH, { recursive: true });
        }
        fs.writeFileSync(tempFilePath, data);

        const uploaded = await this.bot.api.uploadFile({ source: tempFilePath });
        
        let token = uploaded.token;
        if (!token && uploaded.files) {
          const fileKeys = Object.keys(uploaded.files);
          if (fileKeys.length > 0) {
            token = uploaded.files[fileKeys[0]].token;
          }
        }
        
        file = new FileAttachment({ token });
      } else if (typeof data === "string") {
        file = new FileAttachment({ token: data });
      } else {
        throw new Error("[MAX] sendDocument: data must be Buffer or string (token)");
      }

      const result = await this.bot.api.sendMessageToChat(chatId, "", {
        ...options,
        attachments: [file.toJson()],
      });
      return result;
    } catch (error) {
      console.error("[MAX] Send document error:", error);
      throw error;
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  };

  getChat = async (chatId) => {
    try {
      const result = await this.bot.api.getChat(chatId);
      return result;
    } catch (error) {
      console.error("[MAX] Get chat error:", error);
      throw error;
    }
  };
}

module.exports = new MaxBot();