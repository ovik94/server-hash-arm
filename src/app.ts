import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import apiRouter from './routes';
import { logger, logResponseBody } from './utils';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logResponseBody);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/openapi.yaml', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

app.get('/api-docs', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'swagger.html'));
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`REQUEST: ${req.method}-${req.url}`);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  // Для корневого маршрута - ничего не делаем
  if (req.path === '/') {
    return res.status(200).end();
  }

  // Для несуществующих роутов - просто 404 без ошибки
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handling
app.use((err: any, req: Request, res: Response) => {
  res.json({ status: 'ERROR', message: err.message });
});

export default app;
