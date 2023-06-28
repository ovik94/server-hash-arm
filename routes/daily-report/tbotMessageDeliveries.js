const easyTable = require("easy-table");

const createTbotMessage = (data) => {
  const table = new easyTable();

  const sourceEmoji = {
    DEFAULT: '📞',
    'Сайт': '🖥',
    'Приложение IOS': '📱iOS',
    'Приложение Android': '📲'
  };

  const serviceTypeEmoji = {
    COURIER: '🚛',
    PICKUP: '🚶‍♂'
  };

  const filteredData = data.filter(deliveryItem => !!deliveryItem['Delivery.ServiceType']);
  const totalAmount = filteredData.reduce((sum, current) => sum + current.DishDiscountSumInt, 0);
  const total = filteredData.reduce((sum, current) => sum + current.UniqOrderId, 0);

  filteredData.forEach((item, index) => {
    table.cell("Место", sourceEmoji[item['Delivery.MarketingSource'] || 'DEFAULT'], easyTable.string());
    table.cell("Тип", serviceTypeEmoji[item['Delivery.ServiceType']], easyTable.string());
    table.cell("К-во", item.UniqOrderId, easyTable.string());
    table.cell("Сумма", item.DishDiscountSumInt, easyTable.string());
    table.newRow();
  });

  const message = `ДОСТАВКА

   <pre>${table.toString()}</pre>
   
Всего: <b>${total}</b> шт на сумму <b>${totalAmount} ₽</b>
`;

  return message;
}

module.exports = createTbotMessage;
