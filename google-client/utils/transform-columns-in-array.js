const transformColumnsInArray = (data) => {
  const heads = data[0];
  const rows = data.slice(1);
  const result = [];

  heads.forEach(item => result.push({ title: item, items: []}));

  rows.forEach((row) => {
    row.forEach((value, index) => {
      result[index].items.push(value);
    });
  });

  return result;
};

module.exports = transformColumnsInArray;
