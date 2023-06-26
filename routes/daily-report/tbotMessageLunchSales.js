const createTbotMessage = (data) => {
  const message = `<b>БИЗНЕС-ЛАНЧ</b>
Продажи по бизнес-ланчу на сумму: <b>${data.DishDiscountSumInt} ₽</b>
Кол-во чеков: <b>${data.UniqOrderId} шт</b>`

  return message;
}

module.exports = createTbotMessage;
