module.exports = ` <html lang="en">
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
        background-image: url("https://cdn.foodsoul.ru/zones/ru/chains/4373/images/main/37816363bcc827763c49ce31eda53578.png");
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
        margin-bottom: 16px;
      }

      .receipt,
      .expenses,
      .prepays {
        margin-bottom: 24px;
      }

      .receipt_total,
      .expenses_item,
      .prepays_item,
      .lunch_item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        align-items: baseline;
      }

      .receipt_total {
        margin-top: 16px;
      }

      .receipt_block {
        display: flex;
        gap: 8;
        margin-top: 8px;
      }

      .receipt_item {
        flex: 1 1 auto;
      }

      .receipt_item_name {
        margin-top: 16px;
        text-align: center;
      }

      .expenses_item_subtitle,
      .prepays_item_subtitle {
        flex-grow: 2;
        margin-left: 24px;
        opacity: 0.8;
      }

      .deliveries,
      .lunch {
        background-color: #dddddd;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .deliveries_title,
      .lunch_title,
      .revenue_title,
      .prepays_title {
        margin-bottom: 8px;
      }

      .revenue {
        padding-bottom: 48px;
      }

      .progressBar {
        position: relative;
        margin-top: 54px;
      }

      .progressBar_default {
        width: 100%;
        height: 10px;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid rgb(0, 0, 0, 0.3);
      }

      .progressBar_success {
        width: {{progress}}; 
        height: 10px;
        background-color: rgb(180, 132, 132);
        border-radius: 8px;
        border: 1px solid rgb(0, 0, 0, 0);
        position: absolute;
        top: 0;
        left: 0;
      }

      .progressBar_start_date {
        position: absolute;
        left: 0;
        top: 40px;
      }

      .progressBar_end_date {
        position: absolute;
        right: 0;
        top: 40px;
      }

      .progressBar_current_date {
        position: absolute;

        left: {{progress}};
        top: 16px;
      }

      .revenue_value {
        position: absolute;

        left: {{progress}}; 
        top: -40px;
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
          <span class="font24">{{type}} за <span class="primaryColor">{{date}}</span>
          </span>
          <span class="font16">Администратор: <span class="primaryColor">{{adminName}}</span>
          </span>
        </div>
        <div class="receipts">
          <div class="receipts_title">
            <span class="font18">Поступления:</span>
          </div>
          <div class="line"></div>
          <div class="receipt">
            <div class="receipt_item_name">
              <span>ИП Багдасарян</span>
            </div>
            <div class="receipt_block">
              <div class="receipt_item"> Наличные: <div class="primaryColor">{{ipCash}} ₽</div>
              </div>
              <div class="receipt_item"> Эквайринг: <div class="primaryColor">{{ipAcquiring}} ₽</div>
              </div>
              <div class="receipt_item"> Нетмонет: <div class="primaryColor">{{#if ipNetmonet}}
                    {{ipNetmonet}}
                  {{else}} 0 {{/if}} ₽</div>
              </div>
              <div class="receipt_item"> Онлайн: <div class="primaryColor">{{#if ipOnline}}
                    {{ipOnline}}
                  {{else}} 0 {{/if}} ₽</div>
              </div>
              <div class="receipt_item"> Яндекс.Еда и Деливери: <div class="primaryColor">{{#if yandex}}
                    {{yandex}}
                  {{else}} 0 {{/if}} ₽</div>
              </div>
            </div>
            <div class="receipt_item_name">
              <span>ООО «ХашЛаваш»</span>
            </div>
            <div class="receipt_block">
              <div class="receipt_item"> Наличные: <div class="primaryColor">{{oooCash}} ₽</div>
              </div>
              <div class="receipt_item"> Эквайринг: <div class="primaryColor">{{oooAcquiring}} ₽</div>
              </div>
              <div class="receipt_item"> Нетмонет: <div class="primaryColor">{{#if oooNetmonet}}
                    {{oooNetmonet}}
                  {{else}} 0 {{/if}} ₽</div>
              </div>
            </div>
            <div class="receipt_total">
              <div class="receipt_total_sum">
                <span>Общая выручка: <span class="primaryColor font24">{{totalSum}} ₽</span>
                </span>
              </div>
              <div class="receipt_total_cash">
                <span>Сдано наличных: <span class="primaryColor">{{totalCash}} ₽</span>
                </span>
              </div>
            </div>
          </div>
          {{#if prepays}}
            <div class="prepays">
              <div class="prepays_title">
                <span class="font18">Предоплаты:</span>
              </div>
              <div class="line"></div>
              {{#each prepays}}
                <div class="prepays_item">
                  <div class="prepays_item_title">
                    <span>{{paymentType}}</span>
                  </div>
                  <div class="prepays_item_subtitle">
                    <span class="subtitle">{{guestsCount}} чел.</span>
                  </div>
                  <span class="primaryColor">{{sum}} ₽</span>
                </div>
              {{/each}}
            </div>
          {{/if}}
          <div class="expenses">
            <div class="expenses_title">
              <span class="font18">Расходы:</span>
            </div>
            <div class="line"></div>
            {{#each expenses}}
              <div class="expenses_item">
                <div class="expenses_item_title">
                  <span>{{title}}</span>
                </div>
                <div class="expenses_item_subtitle">
                  <span class="subtitle">{{comment}}</span>
                </div>
                <span class="primaryColor">{{sum}} ₽</span>
              </div>
            {{/each}}
          </div>
          <div class="deliveries">
            <div class="deliveries_title">
              <span class="font18">Отчет по доставке</span>
            </div>
            <table>
              <tr>
                <th>Источник</th>
                <th>Тип заказа</th>
                <th>Количество</th>
                <th>Сумма</th>
              </tr>
              {{#each deliveries}}
                <tr>
                  <td>{{source}}</td>
                  <td>{{type}}</td>
                  <td>{{orderCount}}</td>
                  <td>{{sum}} ₽</td>
                </tr>
              {{/each}}
              <tr>
                <td></td>
                <td></td>
                <td>{{totalDeliveries}}</td>
                <td class="primaryColor">{{totalDeliveriesSum}} ₽</td>
              </tr>
            </table>
          </div>
          <div class="lunch">
            <div class="lunch_title">
              <span class="font18">Отчет по бизнес-ланчу</span>
            </div>
            <div class="line"></div>
            <div class="lunch_item">
              <div class="lunch_item_title">
                <span>Продажи</span>
              </div>
              <span class="primaryColor">{{DishDiscountSumInt}} ₽</span>
            </div>
            <div class="lunch_item">
              <div class="lunch_item_title">
                <span>Количество чеков</span>
              </div>
              <span class="primaryColor">{{UniqOrderId}} шт</span>
            </div>
          </div>
          <div class="revenue">
            <div class="revenue_title">
              <span class="font18">Выручка за месяц:</span>
            </div>
            <div class="line"></div>
            <div class="progressBar">
              <div class="progressBar_default"></div>
              <div class="progressBar_success"></div>
              <div class="progressBar_start_date">
                <span class="font16">{{progressBarStartDate}}</span>
              </div>
              <div class="progressBar_current_date">
                <span class="font16">{{progressBarCurrentDate}}</span>
              </div>
              <div class="progressBar_end_date">
                <span class="font16">{{progressBarEndDate}}</span>
              </div>
              <div class="revenue_value">
                <span class="font24 primaryColor">{{revenue}} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html> `;
