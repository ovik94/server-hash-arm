import fs from "fs";
import multiparty from "multiparty";
import xlsx from "node-xlsx";

/**
 * Возвращает данные из xlsx файла в виде массива
 */
export const getExcelFile = async (
  req: any
): Promise<{ data: any[]; companyType: string }> => {
  const form = new multiparty.Form();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const file = files.file?.[0];
      if (!file) {
        return reject(new Error('No file provided'));
      }
      const fileData = xlsx.parse(fs.readFileSync(file.path), {
        cellDates: true,
        dateNF: 'dd"."mm"."yyyy',
        raw: false,
      });

      const companyType = fields.companyType?.[0] || '';
      resolve({ data: fileData[0].data, companyType });
    });
  });
};

