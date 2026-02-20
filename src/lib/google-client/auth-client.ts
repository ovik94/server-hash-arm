import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { google } from 'googleapis';

const readFile = promisify(fs.readFile);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATHS = path.join(__dirname, 'credentials.json');

interface Credentials {
  client_email: string;
  private_key: string;
}

export const getAuthClient = async (): Promise<unknown> => {
  const content = await readFile(CREDENTIALS_PATHS).catch((error: Error) =>
    console.log('Error loading client secret file:', error)
  );

  const { client_email, private_key } = JSON.parse(content as unknown as string) as Credentials;

  return new google.auth.JWT(
    client_email,
    undefined,
    private_key,
    SCOPES
  );
};
