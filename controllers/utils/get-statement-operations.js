const getCashFlowStatement = require("./get-cash-flow-statement");

const CounterpartiesModel = require("../../model/counterparties");
const CashFlowStatementModel = require("../../model/сashFlowStatement");

const getStatementOperations = async (operations, paymentOperation) => {
  const counterparties = await CounterpartiesModel.find({});
  const processedOperations = [];

  for (let operation of operations) {
    const counterparty = counterparties.find(
      (item) => item.companyName === operation.name
    );

    const cashFlowStatement = await getCashFlowStatement(operation, paymentOperation);

    if (!counterparty) {
      processedOperations.push({ status: "COUNTERPARTY_FAIL", operation });
    } else if (!cashFlowStatement) {
      processedOperations.push({ status: "OPERATION_FAIL", operation });
    } else {
      processedOperations.push({ status: "SUCCESS", operation });
    }
  }

  return processedOperations;
};

module.exports = getStatementOperations;
