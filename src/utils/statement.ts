// Утилиты для работы с банковскими выписками и ДДС

import moment from "moment";
import { CashFlowStatementModel, CounterpartiesModel } from "../models";

export const transformStatementAmount = (amount?: string | null) =>
  amount?.replace(",", "").replace(".", ",");

export async function getCashFlowStatement(
  operation: any,
  paymentOperation: string
): Promise<string | undefined> {
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

  let result: string | undefined;

  for (const item in cashFlowStatements) {
    const statementItem = (cashFlowStatements as any)[item];

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
}

export async function getStatementOperations(
  operations: any[],
  paymentOperation: string
) {
  const processedOperations: any[] = [];

  for (const operationItem of operations) {
    const { operation } = operationItem;

    let counterparty = await CounterpartiesModel.findOne({
      companyName: operation.name,
    });

    if (!counterparty) {
      const counterparties = await CounterpartiesModel.find({});
      counterparty = counterparties.find(
        (item: any) =>
          item.companyName && operation.name.includes(item.companyName)
      );
    }

    const cashFlowStatement = await getCashFlowStatement(
      operation,
      paymentOperation
    );

    if (!counterparty) {
      processedOperations.push({ status: "COUNTERPARTY_FAIL", operation });
    } else if (!cashFlowStatement) {
      processedOperations.push({ status: "OPERATION_FAIL", operation });
    } else {
      processedOperations.push({ status: "SUCCESS", operation });
    }
  }

  return processedOperations;
}

export function createCommentDate(operation: any, type: string) {
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

  let operationDate: string | undefined;
  let day: string | undefined;
  let month: string | undefined;
  let year: string | undefined;

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
      operationDate = moment(operationDate, "DD.MM.YYYY")
      .subtract(1, "days")
      .format("DD.MM.YYYY");
    }

    return operationDate;
  }

  if (hasQrCode) {
    const matchDate = operation.purposeOfPayment.match(/на дату (.*?).Сумма/);
    operationDate = matchDate ? matchDate[1] : undefined;
    return operationDate;
  }

  if (operationDate && operationDate.length === 7) {
    operationDate = "0" + operationDate;
  }

  if (operationDate) {
    return `${day}.${month}.${year}`;
  }

  return "";
}

