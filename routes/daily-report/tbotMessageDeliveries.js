const createTbotMessage = (data) => {
  let message = 'ДОСТАВКА';

  data.items.forEach(item => {
    message += `
<i>${item.label}</i>: ${item.count} шт на сумму <b>${item.value} ₽</b>
`});

  message += `

Всего доставок <b>${data.sumCount}</b> шт на сумму <b>${data.sumAmount} ₽</b>`

  return message;
}

module.exports = createTbotMessage;
