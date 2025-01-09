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
            width: 200px;
            height: 50px;
            background-image: url("https://cdn.foodsoul.ru/zones/ru/chains/4373/images/themes/site/6e29c555dcd399abbb1aeaf149cbc03e.png");
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
            box-sizing: border-box;
            display: flex;
            border: 1px solid #9f2720;
        }

        .left-block {
            width: 380px;
            margin-right: 32px;
        }

        .right-block {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            width: 170px;
            height: 100%;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            align-items: center;
        }

        .header_data {
            margin-left: 16px;
        }

        .receipt {
            display: flex;
            flex-direction: column;
            margin-bottom: 24px;
        }

        .receipt span {
            margin-bottom: 8px;
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
            width: 120px;
            height: 378px;
            border-right: 1px solid black;
        }

        .progressBar_date {
            position: relative;
            height: 378px;
            width: 50px;
        }

        .progressBar_success {
            width: 100%;
            height: {{progress}};
            border-radius: 8px;
            border: 1px solid rgb(0,
            0,
            0,
            0);
            position: absolute;
            bottom: 0;
            left: 10px;
            border-radius: 0;
            border-top: 1px dashed #9f2720;
        }

        .progress {
            display: flex;
        }

        .progressBar_start_date {
            position: absolute;
            left: 8px;
            bottom: 0;
        }

        .progressBar_end_date {
            position: absolute;
            top: 0;
            left: 8px;
        }

        .progressBar_current_date {
            position: absolute;

            bottom: calc({{progress}} - 25px);
            right: 8px;
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
      
      	.font14 {
            font-size: 14px;
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
        <div class="content">
            <div class="left-block">

                <div class="header">
                    <div class="logo"></div>
                    <div class="header_data">
                        <span class="font18">{{type}} за <span class="primaryColor">{{date}}</span>
                        </span>
                        <span class="font16">Администратор: <span class="primaryColor">{{adminName}}</span>
                        </span>
                    </div>

                </div>
                <div class="receipts">
                    <div class="receipts_title">
                        <span class="font18">Поступления:</span>
                    </div>
                    <div class="line"></div>
                    <div class="receipt">
                        <span>Наличные: <span class="primaryColor font18">{{cash}} ₽</span>
                        </span>
                        <span>Эквайринг: <span class="primaryColor font18">{{acquiring}} ₽</span>
                        </span>
                       <span>Яндекс.Еда: <span class="primaryColor font18">{{yandex}} ₽</span>
                        </span>
                        <span>Общая выручка: <span class="primaryColor font24">{{totalSum}} ₽</span>
                        </span>
                    </div>
                </div>
                <div class="line"></div>

                {{#if comment}}
                <div class="comment-block">
                    <div class="comment_title">
                        <span class="font14">Комментарий:</span>
                    </div>
                    <div class="line"></div>
                    <div class="comment">
                        <span class="font12">{{comment}}</span>
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
                <div class="progress">
                    <div class="progressBar">
                        <div class="progressBar_success"></div>

                        <div class="progressBar_current_date">
                            <span class="font12">{{progressBarCurrentDate}}</span>
                        </div>

                        <div class="revenue_value">
                            <span class="font18 primaryColor">{{revenue}} ₽</span>
                        </div>
                    </div>
                    <div class="progressBar_date">
                        <div class="progressBar_start_date">
                            <span class="font12">{{progressBarStartDate}}</span>
                        </div>
                        <div class="progressBar_end_date">
                            <span class="font12">{{progressBarEndDate}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
