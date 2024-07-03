const transformedDate = (date) => {
  const dateArray = date.split(".");
  const day = Number(dateArray[0]) + 1;
  const month = Number(dateArray[1]) - 1;
  const year = Number(dateArray[2]);
  return new Date(year, month, day);
};

module.exports = transformedDate;
