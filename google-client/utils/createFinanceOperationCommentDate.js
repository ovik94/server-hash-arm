const createFinanceOperationCommentDate = (operation, type) => {
  const hasSbp = operation.purposeOfPayment.includes('СБП');
  const hasEquaringIp = type === 'Эквайринг ИП';
  const hasEquaringOOO = type === 'Эквайринг ООО';

  let operationDate;
  let day;
  let month;
  let year;

  if (hasSbp) {
    operationDate = operation.purposeOfPayment.substr(3, 6);
    year = `20${operationDate.substr(4, 2)}`;
    month = operationDate.substr(2, 2);
    day = operationDate.substr(0, 2);
  }

  if (hasEquaringIp && !hasSbp) {
    operationDate = operation.purposeOfPayment.match(/Р.С. Р.([\s\S]*) [^К.\s]*/)[1]
    year = operationDate.substr(-4, 4);
    month = operationDate.substr(-6, 2);
    day = String(Number(operationDate.substr(-8, 2)) - 1);
  }

  if (hasEquaringOOO && !hasSbp) {
    operationDate = operation.purposeOfPayment.match(/Р.([\s\S]*) [^К.\s]*/)[1];
    year = operationDate.substr(-4, 4);
    month = operationDate.substr(-6, 2);
    day = String(Number(operationDate.substr(-8, 2)) - 1);
  }

  if (operationDate.length === 7) {
    operationDate = '0' + operationDate;
  }

  if (operationDate) {
    return `${day}.${month}.${year}`
  }

  return '';
};

module.exports = createFinanceOperationCommentDate;
