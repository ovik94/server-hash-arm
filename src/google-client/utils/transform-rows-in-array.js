const transformValue = require('./transform-value');

const transformRowsInArray = (data) => {
  const items = [];
  const heads = data[0];
  const rows = data.slice(1);

  rows.forEach((row) => {
    const item = {};
    row.forEach((value, index) => {
      const key = heads[index];
      item[key] = transformValue(value);
    });

    items.push(item);
  });

  return items;
};

module.exports = transformRowsInArray;
