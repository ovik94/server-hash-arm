const { getExcelFile } = require("../utils/get-excel-file");
const { statementController } = require("../src/google-client/controllers");
const { transformStatementAmount } = require("./utils");

const CompanyNames = {
  ipHashLavash: "БАГДАСАРЯН РАФИК СРАПИОНОВИЧ (ИП)",
  oooHashLavash: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ХАШЛАВАШ"',
  ipFoodTrack: "ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ БАГДАСАРЯН РАФИК СРАПИОНОВИЧ",
};

const PaymentsOperations = {
  ipHashLavash: "Альфа р/c ИП",
  oooHashLavash: "Альфа р/c ООО",
  ipFoodTrack: "Сбербанк р/с",
};

const parseAlfaStatement = (data, companyType) => {
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

const parseSberStatement = (data, companyType) => {
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

const process = async (req, res) => {
  try {
    let companyName;

    const operations = await getExcelFile(req).then(({ data, companyType }) => {
      companyName = companyType;

      if (companyType === "ipHashLavash" || companyType === "oooHashLavash") {
        return parseAlfaStatement(data, companyType);
      }

      if (companyType === "ipFoodTrack") {
        return parseSberStatement(data, companyType);
      }
    });

    const processedOperations = await statementController.addStatementOperation(
      operations,
      PaymentsOperations[companyName]
    );
    return res.json({ status: "OK", data: processedOperations });
  } catch (err) {
    console.log(err, "err");
    return res.json({ status: "ERROR", message: err.message });
  }
};

module.exports = { process };
