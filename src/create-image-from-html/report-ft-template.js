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
      padding: 20px 0;
      overflow: hidden;
      font-family: DaxlinePro, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
        'Liberation Sans', sans-serif;
    }

    .logo {
      width: 228px;
      height: 82px;
      background-image: url("https://img-api.yumapos.ru/image/crop/original/1992424e-127b-a3e3-f3a3-4dbba95fdb06.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 24px;
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
      box-sizing: border-box;
      display: flex;
      border: 1px solid #9f2720;
    }

    .left-block {
      width: 400px;
      margin-right: 32px;
    }

    .right-block {
      width: 170px;
      height: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      align-items: center;
    }

    .receipt {
      margin-bottom: 24px;
    }

    .receipt_item,
    .receipt_total {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      align-items: baseline;
    }

    .receipt_item_name {
      width: 220px;
    }

    .receipt_item_cash {
      width: 220px;
    }

    .receipt_item_equaring {
      width: 220px;
      text-align: right;
    }

    .comment-block {
      background-color: #dddddd;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .comment_title {
      margin-bottom: 8px;
    }

    .revenue {
      margin-bottom: 16px;
    }

    .progressBar {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: #DFD3C3;
      height: 378px;
      border-radius: 8px;
    }

    .progressBar_success {
      width: 100%;
      height: {{progress}};
      background-color: rgb(180, 132, 132);
      border-radius: 8px;
      border: 1px solid rgb(0, 0, 0, 0);
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 0;
    }

    .progressBar_start_date {
      position: absolute;
      left: 0;
      bottom: 0;
    }

    .progressBar_end_date {
      position: absolute;
      top: 0;
    }

    .progressBar_current_date {
      position: absolute;

      bottom: calc({{progress}} - 25px);
      left: 0;
    }

    .revenue_value {
      position: absolute;
      right: 8px;

      bottom: calc({{progress}} + 4px);
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

    .font12 {
        font-size: 12px;
        font-weight: 400;
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
      <div class="left-block">
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
            <div class="receipt_item">
              <div class="receipt_item_cash">
                <span>Наличные: <span class="primaryColor">{{cash}} ₽</span>
                </span>
              </div>
              <div class="receipt_item_equaring">
                <span>Эквайринг: <span class="primaryColor">{{acquiring}} ₽</span>
                </span>
              </div>
            </div>
            <div class="receipt_total">
              <div class="receipt_total_sum">
                <span>Общая выручка: <span class="primaryColor font24">{{totalSum}} ₽</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {{#if comment}}
          <div class="comment-block">
            <div class="comment_title">
              <span class="font18">Комментарий:</span>
            </div>
            <div class="line"></div>
            <div class="comment">
              <span class="font16">{{comment}}</span>
            </div>
          </div>
        {{/if}}
      </div>
      <div class="right-block">
        <div class="revenue">
          <div class="revenue_title">
            <span class="font18">Выручка за месяц:</span>
          </div>
          <div class="line"></div>
        </div>
        <div class="progressBar">
          <div class="progressBar_success"></div>
          <div class="progressBar_start_date">
            <span class="font12">{{progressBarStartDate}}</span>
          </div>
          <div class="progressBar_current_date">
            <span class="font12">{{progressBarCurrentDate}}</span>
          </div>
          <div class="progressBar_end_date">
            <span class="font12">{{progressBarEndDate}}</span>
          </div>
          <div class="revenue_value">
            <span class="font18 primaryColor">{{revenue}} ₽</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
