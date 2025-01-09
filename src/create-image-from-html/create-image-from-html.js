const nodeHtmlToImage = require("node-html-to-image");
const reportHtml = require("./report-template");
const feedbackHtml = require("./feedback-template");
const banquetHtml = require("./banquet-template");
const reportFtHtml = require("./report-ft-template");
const giftCardsHtml = require("./gift-cards-template");

const TemplateTypes = {
  REPORT: "REPORT",
  FEEDBACK: "FEEDBACK",
  BANQUET: "BANQUET",
  REPORT_FT: "REPORT_FT",
  GIFT_CARDS: "GIFT_CARDS",
};

const Templates = {
  REPORT: reportHtml,
  FEEDBACK: feedbackHtml,
  BANQUET: banquetHtml,
  REPORT_FT: reportFtHtml,
  GIFT_CARDS: giftCardsHtml,
};

/**
 * Создает картинку по шаблону html
 * @async
 * @property {any} content
 * @property {TemplateTypes} type
 * @returns {Buffer}
 */
const createImageFromHtml = async (content, type = "REPORT", options) => {
  const puppeteerArgs = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium-browser",
  };

  return await nodeHtmlToImage({
    html: Templates[type],
    puppeteerArgs,
    content,
    type: "jpeg",
    quality: 100,
    ...options,
  });
};

module.exports = { createImageFromHtml };
