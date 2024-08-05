const transformDeliverySales = require("./transform-delivery-sales");
const transformStatementAmount = require("./transform-statement-amount");
const sendReportFtToTelegram = require("./send-report-ft-to-telegram");
const sendReportToTelegram = require("./send-report-to-telegram");
const saveMetrics = require("./save-metrics");
const getStatementOperations = require("./get-statement-operations");
const createCommentDate = require("./create-finance-operation-comment-date");
const getOperationType = require("./get-operation-type");

module.exports = {
  transformDeliverySales,
  transformStatementAmount,
  sendReportFtToTelegram,
  sendReportToTelegram,
  saveMetrics,
  getStatementOperations,
  createCommentDate,
  getOperationType,
};
