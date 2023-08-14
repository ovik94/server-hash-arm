const fs = require("fs");
const multiparty = require("multiparty");
const xlsx = require("node-xlsx");

/**
 * Возвращает данные из xlsx файла в виде массива
 * @async
 * @returns {Promise<Array>}
 */
const getExcelFile = async (req) => {
  const form = new multiparty.Form();

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const file = files.file[0];
      const fileData = xlsx.parse(fs.readFileSync(file.path));

      resolve({ data: fileData[0].data, type: fields.type[0] });
    });
  });
};

module.exports = { getExcelFile };
