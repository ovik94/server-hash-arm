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
        .content {
            background-color: #E7E7E7;
            padding: 36px;
            border-radius: 16px;
            width: 740px;
            box-sizing: border-box;
        }
        
        .item_sub_response {
            margin-right: 16px;
        }
        
        .primaryColor {
            color: #9f2720;
        }

        .font20 {
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
        
        .mr {
            margin-right: 8px;
        }
        
        .ml {
            margin-left: 8px;
        }
    </style>
</head>
<body>
<div class="root">
    <div class="logo"></div>
    <div class="content">
    {{#each data}}
    <div class="item_request">
        <span class="primaryColor font20">{{title}}</span>
    </div>
    <div class="item_response">
        {{#if hasSubOptions}}
              {{#each response}}
                <div class="item_sub_response">
                    <span class="mr font18">{{label}}</span>
                    -
                    <span class="ml font16">{{value}}</span>
                </div>
               {{/each}} 
        {{else}}
              <div class="item_response_value">
                <span class="font16">{{response}}</span>
              </div>
        {{/if}}
    {{/each}}   
    </div>
</div>
</body>
</html>
`
