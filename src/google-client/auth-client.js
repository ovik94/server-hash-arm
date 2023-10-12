const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { google } = require("googleapis");

const readFile = promisify(fs.readFile);
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const CREDENTIALS_PATHS = path.join(__dirname, "credentials.json");

/**
 * Создает клиента для аутентификации в сервисах Google.
 * @async
 * @returns {Promise<Object>}  google.auth.JWT instance
 */
const getAuthClient = async () => {
  const content = await readFile(CREDENTIALS_PATHS).catch((error) =>
    console.log("Error loading client secret file:", error)
  );

  const { client_email, private_key } = JSON.parse(content);

  const client = new google.auth.JWT(client_email, null, private_key, SCOPES, null);

  return client;
};

module.exports = { getAuthClient };
