const getOpertionType = async (operation, operationTypes) => {
  let type;

  for (const operationType in operationTypes) {
    const typeItem = operationTypes[operationType];

    if (typeItem.name) {
      const items = typeItem.name.split(";");

      for (const key in items) {
        const purpose = items[key];

        if (
          purpose === operation.name ||
          operation.purposeOfPayment.includes(purpose)
        ) {
          type = typeItem?.type;
          break;
        }
      }

      if (type) {
        break;
      }
    }
  }

  return type;
};

module.exports = getOpertionType;
