import dotenv from 'dotenv';
import { logger } from '../utils';

dotenv.config();

function validateEnv() {
  const required = [
    'IIKO_SERVER_LOGIN',
    'IIKO_SERVER_PASS',
    'MONGO_LOGIN',
    'MONGO_PWD',
    'MONGO_HOST',
    'MONGO_DB',
    'TG_BOT_TOKEN',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

validateEnv();

export const config = {
  iiko: {
    login: process.env.IIKO_LOGIN,
    password: process.env.IIKO_PASS,
    apiLogin: process.env.IIKO_API_LOGIN,
    serverLogin: process.env.IIKO_SERVER_LOGIN,
    serverPassword: process.env.IIKO_SERVER_PASS,
  },
  mongo: {
    login: process.env.MONGO_LOGIN,
    password: process.env.MONGO_PWD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DB,
  },
  tg: {
    botToken: process.env.TG_BOT_TOKEN,
  },
  app: {
    port: parseInt(process.env.PORT || '8082'),
  },
  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
};

logger.info('Configuration loaded');
