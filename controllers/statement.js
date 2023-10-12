const gApi = require("../src/google-client/google-api");
const { getExcelFile } = require("../utils/get-excel-file");

async function process (req, res) {
  try {
    let paymentType;
    const operations = await getExcelFile(req).then(({ data, type }) => {
        const CompanyNames = {
          ip: 'БАГДАСАРЯН РАФИК СРАПИОНОВИЧ (ИП)',
          ooo: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ХАШЛАВАШ"'
        };

        paymentType = type;
        const company = data[2][1];

        if (company !== CompanyNames[type]) {
          throw new Error('Выписка не соответствует выбранной компании');
        }

        return data
          .slice(12)
          .map(item => ({
            date: item[0],
            expense: item[2],
            incoming: item[3],
            name: item[4],
            purposeOfPayment: item[10]
          }))
          .reverse()
      }
    );

    const processedOperations = await gApi.addStatementOperation(operations, paymentType);
    return res.json({ status: 'OK', data: processedOperations });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

module.exports = { process };
