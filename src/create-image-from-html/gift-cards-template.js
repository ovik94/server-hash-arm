module.exports = `<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        .root {
            font-family: Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
                'Liberation Sans', sans-serif;
            width: 1200px;
            height: 500px;
            padding: 24px;
            background: #f4eddb;
            border-radius: 24px;
            border: 1px solid rgba(59, 59, 59, 0.6);
            position: relative;
        }

        .logo {
            width: 250px;
            height: 100px;
            background-image: url("https://cdn.foodsoul.ru/zones/ru/chains/4373/images/themes/site/6e29c555dcd399abbb1aeaf149cbc03e.png");
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
        }

        .info {
            font-family: DaxlinePro, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
                'Liberation Sans', sans-serif;
            font-size: 18px;
            position: absolute;
            bottom: 8px;
        }

        .nominal {
            font-size: 150px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .phone {
            position: absolute;
            bottom: 40px;
            font-size: 25px;
        }

        .number {
            position: absolute;
            bottom: 40px;
            right: 40px;
            font-size: 25px;
            font-weight: bold;
            color: #9f2720;
        }

        .code {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.4);
        }

        .title {
            font-size: 60px;
            position: absolute;
            left: 50%;
            top: 30%;
            transform: translate(-50%, -50%);
            color: #9f2720;
        }
    </style>
</head>

<body>
    <div class="root">
        <div class="logo" />
        <div class="divider" />
        <div class="title">СЕРТИФИКАТ</div>
        <div class="nominal">{{nominal}}</div>
        <div class="number">H-{{nominal}}-{{number}}</div>
        <div class="phone">+7 (960) 795-96-33</div>
        <div class="info">* МНОГОРАЗОВЫЙ СЕРТИФИКАТ ДАЕТ ПРАВО ОПЛАТИТЬ СЧЕТ В РЕСТОРАНЕ ХАШЛАВАШ</div>
        <div class="code">{{code}}</div>

    </div>
</body>

</html>
`;
