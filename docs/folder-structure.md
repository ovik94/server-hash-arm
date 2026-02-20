## Новая структура директорий (проект миграции на TypeScript)

Этот документ описывает целевую структуру проекта после рефакторинга и миграции на TypeScript.  
На этом этапе **ничего физически не переносим**, это дизайн и договорённость.

---

## 1. Общая идея

- **Разделить инфраструктуру и домены**
  - Отдельно инициализация приложения (`app.ts`) и запуск сервера (`server.ts`).
  - Явные слои: `routes` → `controllers` → `services` → `models` / внешние клиенты.
- **Сконцентрировать код в `src/`**
  - Весь новый код и постепенно мигрируемый код живёт в `src/`.
  - Старые JS-файлы остаются рядом до полной миграции (через `allowJs`).

Итоговая структура (высокоуровнево):

```text
src/
  app.ts
  server.ts

  config/
  routes/
  controllers/
  services/
  repositories/
  models/
  dto/
  middleware/
  utils/

  integrations/
    google-client/
    iiko-api/
    telegram-bot/

  create-image-from-html/
```

---

## 2. Инфраструктура: `app` и `server`

- **`src/app.ts`**
  - Создание и конфигурация `Express.Application`.
  - Подключение middleware: логирование, CORS, парсеры, обработчики ошибок.
  - Подключение корневого роутера из `src/routes/index.ts`.

- **`src/server.ts`**
  - Импорт готового `app` из `src/app.ts`.
  - Чтение конфигурации (порт, URL базы данных и т.п.) из `src/config`.
  - Подключение к MongoDB (через `mongoose`).
  - Запуск HTTP-сервера (`app.listen`).

Текущий `server.js` в корне постепенно будет заменён на `src/server.ts` (через сборку / `tsc`).

---

## 3. Конфигурация: `src/config`

Назначение — единое место для работы с переменными окружения и константами.

- **`src/config/index.ts`**
  - Типизированный объект конфигурации (порт, Mongo URL, ключи внешних сервисов и т.д.).
  - Валидация обязательных переменных окружения.

При необходимости:

- `src/config/logger.ts` — настройка логгера.
- `src/config/mongoose.ts` — утилиты подключения к базе (опционально, если не делать это прямо в `server.ts`).

---

## 4. Маршруты: `src/routes`

Назначение — **HTTP-маршрутизация**, без бизнес-логики.

Предлагаемая структура:

```text
src/routes/
  index.ts

  user.routes.ts
  lunch.routes.ts
  wheel-of-fortune.routes.ts
  feedback.routes.ts
  statement.routes.ts
  metrics.routes.ts
  gift-cards.routes.ts
  cash-flow-statement.routes.ts

  app/
    daily-report.routes.ts
    expense.routes.ts
    expense-v2.routes.ts

  iiko/
    iiko.routes.ts
    iiko-cloud.routes.ts
    iiko-server.routes.ts
```

Примеры соответствия текущих файлов:

- Текущий `routes/index.js` → `src/routes/index.ts`.
- `routes/user.js` → `src/routes/user.routes.ts`.
- `routes/app/daily-report.js` → `src/routes/app/daily-report.routes.ts`.
- `routes/iiko/iiko-cloud.js` → `src/routes/iiko/iiko-cloud.routes.ts` и т.д.

Каждый роут:

- Импортирует `express.Router`.
- Описывает пути и HTTP-методы.
- Делегирует выполнение в соответствующие контроллеры из `src/controllers`.

---

## 5. Контроллеры: `src/controllers`

Назначение — **тонкий HTTP-слой**, который:

- Принимает `Request`, `Response`, `NextFunction`.
- Достаёт и валидирует данные из `req.body`, `req.query`, `req.params` (с использованием DTO/валидации).
- Вызывает методы сервисов.
- Формирует ответ в виде `{ status, data, message }` без прямого доступа к БД.

Структура:

```text
src/controllers/
  user.controller.ts
  lunch.controller.ts
  wheel-of-fortune.controller.ts
  feedback.controller.ts
  statement.controller.ts
  metrics.controller.ts
  gift-cards.controller.ts
  cash-flow-statement.controller.ts

  app/
    daily-report.controller.ts
    expense.controller.ts
    expense-v2.controller.ts

  iiko/
    iiko.controller.ts
    iiko-cloud.controller.ts
    iiko-server.controller.ts
```

Пример соответствия текущих файлов:

- `controllers/user.js` → `src/controllers/user.controller.ts`.
- `controllers/daily-report.js` → `src/controllers/app/daily-report.controller.ts`.
- `controllers/gift-cards.js` → `src/controllers/gift-cards.controller.ts` и т.д.

---

## 6. Сервисы: `src/services`

Назначение — **бизнес-логика** и интеграция с БД / внешними API.

Структура:

```text
src/services/
  user.service.ts
  lunch.service.ts
  wheel-of-fortune.service.ts
  feedback.service.ts
  statement.service.ts
  metrics.service.ts
  gift-cards.service.ts
  cash-flow-statement.service.ts

  app/
    daily-report.service.ts
    expense.service.ts
    expense-v2.service.ts

  iiko/
    iiko.service.ts
    iiko-cloud.service.ts
    iiko-server.service.ts
```

Примеры источников логики для будущих сервисов:

- `controllers/*.js` — бизнес-логика, перемещаемая из контроллеров.
- `controllers/utils/*.js` — общие функции, которые используются разными контроллерами.
- Код работы с Google Sheets, iiko, Telegram и др. (через слой `integrations` и репозитории/модели).

Сервисы:

- Не знают о `req`/`res`.
- Работают с моделями / репозиториями и клиентами внешних сервисов.

---

## 7. Репозитории и модели: `src/repositories` и `src/models`

### 7.1. Модели: `src/models`

Назначение — типизированные сущности и Mongoose-модели.

```text
src/models/
  user.model.ts
  roles.model.ts
  daily-report.model.ts
  daily-report-ft.model.ts
  gift-cards.model.ts
  wheel-of-fortune.model.ts
  feedback.model.ts
  counterparties.model.ts
  cash-flow-statement.model.ts
  bar-limits.model.ts
  temp-expenses.model.ts
```

Соответствие текущим файлам:

- `model/user.js` → `src/models/user.model.ts`.
- `model/dailyReport.js` → `src/models/daily-report.model.ts`.
- `model/giftCards.js` → `src/models/gift-cards.model.ts`.
- `model/roles.js` → `src/models/roles.model.ts`.
- `model/barLimits.js` → `src/models/bar-limits.model.ts`.
- `model/tempExpenses.js` → `src/models/temp-expenses.model.ts`.
- `model/banquets.js` → `src/models/banquets.model.ts`.
- `model/dailyReportFT.js` → `src/models/daily-report-ft.model.ts`.
- `model/feedback.js` → `src/models/feedback.model.ts`.
- `model/counterparties.js` → `src/models/counterparties.model.ts`.
- `model/сashFlowStatement.js` → `src/models/cash-flow-statement.model.ts`.
- `model/wheelOfFortune.js` и `model/wheelOfFortuneContent.js` → `src/models/wheel-of-fortune.model.ts` (обе схемы в одном файле).

### 7.2. Репозитории: `src/repositories` (опциональный слой)

Назначение — обёртки над Mongoose-моделями, чтобы изолировать детали хранения.

```text
src/repositories/
  user.repository.ts
  daily-report.repository.ts
  gift-cards.repository.ts
  ...
```

Каждый репозиторий:

- Инкапсулирует `Model<T>` и запросы к БД.
- Предоставляет методы вроде `findById`, `findMany`, `create`, `update`, `delete`.

---

## 8. DTO и валидация: `src/dto`

Назначение — описать контракты входных/выходных данных и централизованную валидацию.

```text
src/dto/
  user/
    create-user.dto.ts
    update-user.dto.ts
    login.dto.ts

  app/
    daily-report.dto.ts
    expense.dto.ts
    expense-v2.dto.ts

  gift-cards/
    gift-card-activate.dto.ts
    gift-card-create.dto.ts
```

В дальнейшем DTO будут связаны с OpenAPI (`openapi.yaml`) и использоваться в контроллерах для типизации `req.body` / `req.query` / `req.params`.

---

## 9. Middleware: `src/middleware`

Назначение — повторно используемые Express-middleware.

```text
src/middleware/
  request-logger.middleware.ts
  error-handler.middleware.ts
  not-found.middleware.ts
  cors.middleware.ts
  auth.middleware.ts (если потребуется)
```

Источники текущей логики:

- Всё, что сейчас инициализируется в `server.js` (логирование, парсеры и т.п.).
- Обработчики ошибок, если появятся.

---

## 10. Утилиты: `src/utils`

Назначение — общие функции, не привязанные к конкретному домену.

```text
src/utils/
  transform-date-string.ts
  get-excel-file.ts
  statement.ts
  delivery.ts
  report.ts
```

Соответствие текущим файлам:

- `utils/transform-date-string.js` → `src/utils/transform-date-string.ts`.
- `utils/get-excel-file.js` → `src/utils/get-excel-file.ts`.
- Утилиты из `controllers/utils/*.js` перенесены в `src/utils/statement.ts`, `src/utils/delivery.ts`, `src/utils/report.ts` и частично в соответствующие сервисы.

---

## 11. Интеграции: `src/integrations`

Назначение — клиенты внешних сервисов (Google, iiko, Telegram и др.).

```text
src/integrations/
  google-client/
    auth-client.ts
    google-api.ts
    controllers/
      banquet-google.controller.ts
      daily-reports-google.controller.ts
      expenses-google.controller.ts
      feedback-google.controller.ts
      financial-operations-google.controller.ts
      metrics-google.controller.ts
      statement-google.controller.ts
    utils/
      get-append-request.ts
      get-delete-batch-request.ts
      table-transform-methods.ts
      transform-columns-in-array.ts
      transform-key-value.ts
      transform-rows-in-array.ts
      transform-value.ts

  iiko-api/
    iiko-cloud-api.ts
    iiko-server-api.ts
    iiko-web-api.ts

  telegram-bot/
    tbot.ts
    get-telegram-chat-id.ts
```

Соответствие текущим файлам:

- `src/google-client/*` → `src/integrations/google-client/*` (с сохранением внутренней структуры).
- `src/iiko-api/*` → `src/integrations/iiko-api/*`.
- `src/telegram-bot/*` → `src/integrations/telegram-bot/*`.

---

## 12. Генерация изображений: `src/create-image-from-html`

Текущая папка `src/create-image-from-html` уже хорошо изолирована от остального кода.

План:

- Перенести как есть в `src/create-image-from-html/` в TypeScript-версию:
  - `create-image-from-html.ts`
  - `banquet-template.ts`
  - `feedback-template.ts`
  - `gift-cards-template.ts`
  - `report-ft-template.ts`
  - `report-template.ts`

---

## 13. Документация и OpenAPI

- `openapi.yaml` и `docs/swagger.html` остаются источником правды для контрактов API.
- После переноса на новую структуру необходимо будет:
  - Обновить пути к `openapi.yaml`/`swagger.html` в конфигурации Express (когда она переедет в `src/app.ts`).
  - Постепенно синхронизировать DTO в `src/dto` с описаниями в OpenAPI.

---

## 14. Миграция: от текущего состояния к целевому

Краткий план миграции в контексте структуры директорий (без кода):

1. **Создать инфраструктурные файлы и папки**
   - `src/app.ts`, `src/server.ts`.
   - Папки `src/config`, `src/routes`, `src/controllers`, `src/services`, `src/models`, `src/repositories`, `src/dto`, `src/middleware`, `src/utils`, `src/integrations`.
2. **Переносить домены по одному**
   - Для каждого домена:
     - Создать `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.model.ts` (и `*.repository.ts`, если нужно).
     - Перенести логику из текущих `routes/*`, `controllers/*`, `model/*`, `src/google-client/*`, `src/iiko-api/*`, `src/telegram-bot/*`.
3. **На каждом шаге гарантировать неизменность контрактов API**
   - Не менять URL, методы, форматы ответов, описанные в `routes/*.js` и `openapi.yaml`.

Данный документ фиксирует целевую структуру директорий и будет использоваться как референс при выполнении следующих задач по миграции на TypeScript.

