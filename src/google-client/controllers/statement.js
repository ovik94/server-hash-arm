const GoogleApi = require("../google-api");
const financialOperations = require("./financial-operations");

class StatementGApiController extends GoogleApi {
  addStatementOperation = async (operationInfo) => {
    const { operation, cashFlowStatement, paymentOperation, counterparty, comment } =
      operationInfo;

    await financialOperations.addFinancialOperation([
      "",
      operation.date,
      cashFlowStatement,
      paymentOperation,
      operation.incoming || operation.expense,
      counterparty.name,
      comment,
    ]);
  };
}

module.exports = new StatementGApiController();
