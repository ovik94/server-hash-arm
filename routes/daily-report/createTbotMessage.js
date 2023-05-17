const createTbotMessage = (data, type = 'add') => {
  const { date, adminName, ipCash, ipAcquiring, oooCash, oooAcquiring, totalSum, totalCash, expenses, yandex } = data;
  let message = `<b>${type === 'add' ? 'Отчет' : 'Обновление отчета'} за ${date}.</b>
<b>Aдмимнистратор: ${adminName}</b>
 
Общая выручка: <b>${totalSum} ₽</b>

<b>ИП Багдасарян</b>
Наличные: <i>${ipCash} ₽</i>
Эквайринг: <i>${ipAcquiring} ₽</i>

<b>ООО ХашЛаваш</b>
Наличные: <i>${oooCash} ₽</i>
Эквайринг: <i>${oooAcquiring} ₽</i>

<b>Яндек.Еда и Деливери</b>
<i>${yandex || '0'} ₽</i>

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
