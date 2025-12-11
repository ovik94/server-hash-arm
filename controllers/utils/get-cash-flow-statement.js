const CashFlowStatementModel = require("../../model/сashFlowStatement");

const getCashFlowStatement = async (operation, paymentOperation) => {
  const cashFlowStatementByName = await CashFlowStatementModel.findOne({
    paymentTypes: paymentOperation,
    purposeOfPayment: operation.name,
  });

  if (cashFlowStatementByName) {
    return cashFlowStatementByName.name;
  }

  const cashFlowStatements = await CashFlowStatementModel.find({
    paymentTypes: paymentOperation,
  });

  let result;


  for (const item in cashFlowStatements) {
    const statementItem = cashFlowStatements[item];

    if (statementItem.purposeOfPayment) {
      for (const key in statementItem.purposeOfPayment) {
        const purpose = statementItem.purposeOfPayment[key];

        if (purpose && operation.purposeOfPayment.includes(purpose)) {
          result = statementItem.name;
          break;
        }
      }

      if (result) {
        break;
      }
    }
  }

  return result;
};

module.exports = getCashFlowStatement;
