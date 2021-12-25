const transformKeyValue = (data, type) => {
  const result = {};

  data.forEach((field) => {
    const value = field[2] && type === 'number' ? Number(field[2]): field[2];
    if (!field[0]) {
      result[field[1]] = value;
    }

    if (field[0]) {
      if (result[field[0]]) {
        result[field[0]] = {...result[field[0]], [field[1]]: value};
      } else {
        result[field[0]] = {[field[1]]: value};
      }
    }
  });

  return result;
};

module.exports = transformKeyValue;
