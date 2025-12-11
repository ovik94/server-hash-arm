const moment = require("moment");

const createFinanceOperationCommentDate = (operation, type) => {
  const hasSbp =
    operation.purposeOfPayment.includes("СБП") &&
    operation.purposeOfPayment.includes("Возм. по согл.");
  const hasEquaringIp = type === "Эквайринг ИП";
  const hasEquaringOOO = type === "Эквайринг ООО";
  const hasEquaringFoodTrack = type === "Эквайринг ИП Сбер (Фудтрак)";
  const hasQrCode = type === "Поступление QR-code";

  if (
    !hasSbp &&
    !hasEquaringIp &&
    !hasEquaringOOO &&
    !hasEquaringFoodTrack &&
    !hasQrCode
  ) {
    return "";
  }

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
    operationDate = operation.purposeOfPayment.match(
      /Р.С. Р.([\s\S]*) [^К.\s]*/
    )[1];
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

  if (hasEquaringFoodTrack && !hasSbp) {
    const merchId = operation.purposeOfPayment.match(/Мерчант №(.*?). /)[1];
    const matchDate = operation.purposeOfPayment.match(
      /Дата реестра (.*?). Комиссия/
    );

    operationDate = matchDate ? matchDate[1] : undefined;

    // для операций по эквайрингу (не СБП) сдвигаем дату на один день назад, т.к. сбер отправляет на следующий день
    if (merchId === "441000170828" && operationDate) {
      operationDate = moment(operationDate, "DD.MM.YYYY").subtract(1, "days").format("DD.MM.YYYY");
    }

    return operationDate;
  }

  if (hasQrCode) {
    const matchDate = operation.purposeOfPayment.match(/на дату (.*?).Сумма/);
    operationDate = matchDate ? matchDate[1] : undefined;
    return operationDate;
  }

  if (operationDate.length === 7) {
    operationDate = "0" + operationDate;
  }

  if (operationDate) {
    return `${day}.${month}.${year}`;
  }

  return "";
};

module.exports = createFinanceOperationCommentDate;
