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
            background-image: url("https://img-api.yumapos.ru/image/crop/original/1992424e-127b-a3e3-f3a3-4dbba95fdb06.png");
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

        .receipt {
            margin-bottom: 24px;
        }

        .receipt_item, .receipt_total {
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

        .revenue_title, .comment_title {
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
            background-color: rgb(180,132,132);
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
            <span class="font24">{{type}} за <span class="primaryColor">{{date}}</span></span>
            <span class="font16">Администратор: <span class="primaryColor">{{adminName}}</span> </span>
        </div>
        <div class="receipts">
            <div class="receipts_title">
                <span class="font18">Поступления:</span>
            </div>
            <div class="line"></div>
            <div class="receipt">
                <div class="receipt_item">
                    <div class="receipt_item_cash">
                        <span>Наличные: <span class="primaryColor">{{cash}} ₽</span></span>
                    </div>
                    <div class="receipt_item_equaring">
                        <span>Эквайринг: <span class="primaryColor">{{acquiring}} ₽</span></span>
                    </div>
                </div>
                <div class="receipt_total">
                    <div class="receipt_total_sum">
                        <span>Общая выручка: <span class="primaryColor font24">{{totalSum}} ₽</span></span>
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
                    <span class="font18">{{comment}}</span>
                </div>
            </div>
            {{/if}}
               
        <div class="revenue">
                <div class="revenue_title">
                    <span class="font18">Выручка за месяц:</span>
                </div>
                <div class="line"></div>
                <div class="progressBar">
                    <div class="progressBar_default"></div>
                    <div class="progressBar_success"></div>
                    <div class="progressBar_start_date"><span class="font16">{{progressBarStartDate}}</span></div>
                    <div class="progressBar_current_date"><span class="font16">{{progressBarCurrentDate}}</span></div>
                    <div class="progressBar_end_date"><span class="font16">{{progressBarEndDate}}</span></div>
                    <div class="revenue_value"><span class="font24 primaryColor">{{revenue}} ₽</span></div>
                </div>
        </div>
    </div>
</div>
</body>
</html>
`;
