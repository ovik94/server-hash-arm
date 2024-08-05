const getOperationType = require("./get-operation-type");

const { statementController } = require("../../src/google-client/controllers");

const getStatementOperations = async (operations, paymentOperation) => {
  const counterparties = await statementController.getFinancialCounterparties();
  const operationTypes = await statementController.getFinancialOperationTypes(
    paymentOperation
  );

  const processedOperations = [];

  for (let operation of operations) {
    const counterparty = counterparties.find(
      (item) => item.includes === operation.name
    );

    const type = await getOperationType(operation, operationTypes);

    if (!counterparty) {
      processedOperations.push({ status: "COUNTERPARTY_FAIL", operation });
    } else if (!type) {
      processedOperations.push({ status: "OPERATION_FAIL", operation });
    } else {
      processedOperations.push({ status: "SUCCESS", operation });
    }
  }

  return processedOperations;
};

module.exports = getStatementOperations;
