module.exports = `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
      .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 774px;
        overflow: hidden;
        font-family: DaxlinePro, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
          'Liberation Sans', sans-serif;
      }

      .logo {
        width: 228px;
        height: 82px;
        background-image: url("https://ru.foodsoul.pro/uploads/chains/4373/images/themes/site/6e29c555dcd399abbb1aeaf149cbc03e.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .line {
        transform-origin: bottom left;
        border-bottom: solid 0.4px #0000004d;
        opacity: 0.5;
        margin-bottom: 16px;
      }

      .content {
        background-color: #E7E7E7;
        padding: 36px;
        border-radius: 16px;
        width: 740px;
        box-sizing: border-box;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .banquet_info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        align-items: baseline;
      }

      .orders_title {
        margin-bottom: 8px;
      }

      .comment {
        margin-top: 16px;
      }
      
      table {
        background-color: #E7E7E7;
        padding: 16px;
        border-radius: 8px;
        width: 100%;
        border: 1px solid #dddddd;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        font-weight: bold;
        padding: 5px;
        background: #efefef;
        border: 1px solid #dddddd;
      }

      td {
        border: 1px solid #dddddd;
        padding: 5px;
      }

      .primaryColor {
        color: #9f2720;
      }

      .font24 {
        font-size: 24px;
      }

      .font18 {
        font-size: 18px;
      }

      .font16 {
        font-size: 16px;
      }

      .subtitle {
        color: #454545;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="root">
      <div class="logo"></div>
      <div class="content">
        <div class="header">
          <span class="font24">{{title}} на <span class="primaryColor">{{date}}</span>
          </span>
          <span class="font16">Администратор: <span class="primaryColor">{{admin}}</span>
          </span>
        </div>
        <div class="line"></div>
        <div class="banquet_info">
            <div>
              <span>Имя: <span class="primaryColor">{{name}}</span></span>
            </div>
            <div>
              <span>Номер телефона: <span class="primaryColor">{{phone}}</span></span>
            </div>
            <div>
              <span>Количество гостей: <span class="primaryColor">{{personsCount}}</span></span>
            </div>
        </div>
        <div class="orders">
          <div class="orders_title">
            <span class="font24">Заказ:</span>
          </div>
          <table>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Кол-во</th>
            </tr>
            {{#each menu}}
              <tr>
                <td>{{title}}</td>
                <td>{{price}} ₽</td>
                <td>{{count}} шт</td>
              </tr>
            {{/each}}
            <tr>
              <td></td>
              <td></td>
              <td class="primaryColor font18">{{sum}} ₽</td>
            </tr>
            {{#if sale}}
              <tr>
                <td></td>
                <td>Скидка:</td>
                <td class="font18">{{sale}} %</td>
              </tr>
              {{/if}}
              {{#if serviceFee}}
                <tr>
                  <td></td>
                  <td>Процент за обслуживание:</td>
                  <td class="font18">12 %</td>
                </tr>
              {{/if}}
                <tr>
                  <td></td>
                  <td>Итого:</td>
                  <td class="primaryColor font24">{{totalAmount}} ₽ </td>
                </tr>
          </table>
        </div>
        {{#if comment}}
        <div class="comment">
            <span class="font24">Комментарий к заказу:</span>
            <div class="font18">{{comment}}</div>
        </div>
        {{/if}}
      </div>
    </div>
  </body>
</html>
`
