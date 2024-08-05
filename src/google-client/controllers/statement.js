const GoogleApi = require("../google-api");
const transformRowsInArray = require("../utils/transform-rows-in-array");
const financialOperations = require("./financial-operations");

class StatementGApiController extends GoogleApi {
  getFinancialCounterparties = async () => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.getSpreadsheetId(),
      range: "Справочник!M3:N100",
    });

    return transformRowsInArray(data.values).map((item) => ({
      counterparty: item["Контрагент"],
      includes: item["Совпадение"],
    }));
  };

  getFinancialOperationTypes = async (paymentOperation) => {
    const api = await this.apiClient;
    const { data } = await api.values.get({
      spreadsheetId: this.getSpreadsheetId(),
      range: "Справочник!B3:K100",
    });

    return transformRowsInArray(data.values)
      .map((item) => ({
        type: item["Статьи ДДС"],
        operationType: item["Тип операции"],
        paymentOperation: item["Тип оплаты"],
        name: item["Контрагент, Назначение платежа"],
      }))
      .filter((item) => item.paymentOperation?.includes(paymentOperation));
  };

  addStatementOperation = async (operationInfo) => {
    const { operation, type, paymentOperation, counterparty, comment } =
      operationInfo;

    await financialOperations.addFinancialOperation([
      "",
      operation.date,
      type,
      paymentOperation,
      operation.incoming || operation.expense,
      counterparty?.counterparty,
      comment,
    ]);
  };
}

module.exports = new StatementGApiController();
