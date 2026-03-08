import { google } from 'googleapis';
import { config } from '../../config';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const getAuthClient = async (): Promise<unknown> => {
  const { clientEmail, privateKey } = config.google;

  if (!clientEmail || !privateKey) {
    console.log('Error loading client secret: missing credentials');
    return null;
  }

  return new google.auth.JWT(clientEmail, undefined, privateKey, SCOPES);
};
