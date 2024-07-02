const GoogleApi = require("../google-api");
const transformRowsInArray = require("../utils/transform-rows-in-array");
const createComment = require("../utils/createFinanceOperationCommentDate");
const getOpertionType = require("./utils/get-operation-type");

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

  addStatementOperation = async (operations, paymentOperation) => {
    const counterparties = await this.getFinancialCounterparties();
    const operationTypes = await this.getFinancialOperationTypes(
      paymentOperation
    );

    const processedOperations = [];

    for (let operation of operations) {
      const counterparty = counterparties.find(
        (item) => item.includes === operation.name
      );

      const type = await getOpertionType(operation, operationTypes);

      if (!counterparty) {
        processedOperations.push({ status: "COUNTERPARTY_FAIL", operation });
      } else if (!type) {
        processedOperations.push({ status: "OPERATION_FAIL", operation });
      } else {
        const comment = createComment(operation, type);

        await this.addFinancialOperation([
          "",
          operation.date,
          type,
          paymentOperation,
          operation.incoming || operation.expense,
          counterparty?.counterparty,
          comment,
        ]);

        processedOperations.push({ status: "SUCCESS", operation });
      }
    }

    return processedOperations;
  };
}

module.exports = new StatementGApiController();
