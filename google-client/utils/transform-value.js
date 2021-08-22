const transformValue = (value) => {
  if (value === 'TRUE') {
    return true;
  }

  if (value === 'FALSE') {
    return false;
  }

  return value || undefined;
};

module.exports = transformValue;
