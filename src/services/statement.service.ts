import { statementGApiController } from "../lib";
import {
  transformStatementAmount,
  getStatementOperations,
  getCashFlowStatement,
  getExcelFile
} from "../utils";
import * as counterpartiesRepository from "../repositories/counterparties.repository";

const CompanyNames: Record<string, string> = {
  ipHashLavash: "БАГДАСАРЯН РАФИК СРАПИОНОВИЧ (ИП)",
  oooHashLavash:
    'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ХАШЛАВАШ"',
  ipFoodTrack:
    "ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ БАГДАСАРЯН РАФИК СРАПИОНОВИЧ",
};

const PaymentsOperations: Record<string, string> = {
  ipHashLavash: "Альфа р/c ИП",
  oooHashLavash: "Альфа р/c ООО",
  ipFoodTrack: "Сбербанк р/с",
};

const parseAlfaStatement = (data: any[], companyType?: string) => {
  const company = data[2][1];

  if (companyType && company !== CompanyNames[companyType]) {
    throw new Error("Выписка не соответствует выбранной компании");
  }

  return data
  .slice(12)
  .map((item) => ({
    date: item[0],
    expense: transformStatementAmount(item[2]),
    incoming: transformStatementAmount(item[3]),
    name: item[4],
    purposeOfPayment: item[10],
  }))
  .reverse();
};

// parseSberStatement оставлен для будущего расширения, как и в исходном коде
const parseSberStatement = (data: any[], companyType?: string) => {
  const company = data[5][12];

  if (companyType && company !== CompanyNames[companyType]) {
    throw new Error("Выписка не соответствует выбранной компании");
  }

  return data.slice(11, -9).map((item) => ({
    date: item[1],
    expense: transformStatementAmount(item[9]),
    incoming: transformStatementAmount(item[13]),
    name: (item[13] ? item[4] : item[8])
    ?.replace("\n", "")
    .replace(/[^a-zA-ZА-Яа-яЁё ]/g, ""),
    purposeOfPayment: item[21],
  }));
};

export const process = async (operations: any[], companyType: string) => {
  for (const operationItem of operations) {
    const { operation } = operationItem;
    const cashFlowStatement = await getCashFlowStatement(
      operation,
      PaymentsOperations[companyType]
    );
    // const comment = createCommentDate(operation, cashFlowStatement);

    let counterparty: any = await counterpartiesRepository.findByType(operation.name);

    if (!counterparty) {
      const counterparties = await counterpartiesRepository.findAll();
      counterparty = counterparties.find(
        (item: any) =>
          item.companyName && operation.name.includes(item.companyName)
      );
    }

    await statementGApiController.addStatementOperation({
      operation,
      counterparty,
      cashFlowStatement,
      paymentOperation: PaymentsOperations[companyType],
      // comment: '',
    });
  }
};

export const load = async (req: any) => {
  let companyName: string | undefined;

  const operations = await getExcelFile(req).then(
    ({ data, companyType }: { data: any[]; companyType: string }) => {
      companyName = companyType;

      if (
        companyType === "ipHashLavash" ||
        companyType === "oooHashLavash"
      ) {
        return parseAlfaStatement(data, companyType);
      }

      // if (companyType === "ipFoodTrack") {
      //   return parseSberStatement(data, companyType);
      // }
    }
  );

  const result = await getStatementOperations(
    operations,
    companyName ? PaymentsOperations[companyName] : undefined
  );

  return result;
};

