const createTbotMessage = (data, type = 'add') => {
  const { date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, expenses } = data;
  let message = `<b>${type === 'add' ? 'Отчет' : 'Обновление отчета'} за ${date}.</b>
<b>Aдмимнистратор: ${adminName}</b>
 
<b>ИП Багдасарян</b>
Наличные: <i>${ipCash} ₽</i>
Эквайринг: <i>${ipAcquiring} ₽</i>

<b>ООО ХашЛаваш</b>
Наличные: <i>${oooCash} ₽</i>
Эквайринг: <i>${oooAcquiring} ₽</i>

Общая выручка: <b>${totalSum} ₽</b>

Расходы:`;

  expenses.forEach(item => {
    message += `
${item.category.title}: ${item.sum} ₽ ${item.comment ? '(' + (item.comment) + ')' : ''}
`});

  message += `

Сдано наличных: <b>${totalCash} ₽</b>`

  return message;
}

module.exports = createTbotMessage;