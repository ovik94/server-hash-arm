const nodeHtmlToImage = require("node-html-to-image");
const reportHtml = require('./report-template');

const TemplateTypes = {
  REPORT: 'REPORT',
};

const Templates = {
  REPORT: reportHtml
}

/**
 * Создает картинку по шаблону html
 * @async
 * @property {any} content
 * @property {TemplateTypes} type
 * @returns {Buffer}
 */
const createImageFromHtml = async (content, type = 'REPORT') => {
  const puppeteerArgs = {
    args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--headless', '--no-zygote', '--disable-gpu' ],
    headless: true,
    ignoreHTTPSErrors: true
  };

  return await nodeHtmlToImage({
    html: Templates[type],
    puppeteerArgs,
    content,
    type: 'jpeg',
    quality: 100
  });
};

module.exports = { createImageFromHtml };
