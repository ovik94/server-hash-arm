import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export const logResponseBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const oldWrite = res.write.bind(res);
  const oldEnd = res.end.bind(res);

  const chunks: Buffer[] = [];

  const toBuffer = (chunk: any): Buffer =>
    Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (res.write as any) = (chunk: any, ...args: any[]): boolean => {
    if (chunk !== undefined) {
      chunks.push(toBuffer(chunk));
    }
    return oldWrite(chunk, ...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (res.end as any) = (chunk: any, ...args: any[]): any => {
    if (chunk !== undefined && chunk !== null) {
      chunks.push(toBuffer(chunk));
    }
    if (chunks.length) {
      const body = Buffer.concat(chunks).toString('utf8');
      // eslint-disable-next-line no-console
      logger.info(`RESPONSE: ${req.method}-${req.url} ${body}`);
    }
    return oldEnd(chunk, ...args);
  };

  next();
};
