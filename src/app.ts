import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import apiRouter from "./routes";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
// isProduction пока не используется, но оставляем для возможной дальнейшей конфигурации

const logResponseBody = (
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
      const body = Buffer.concat(chunks).toString("utf8");
      // eslint-disable-next-line no-console
      console.info("RESPONSE:", `${req.method}-${req.url}`, body);
    }
    return oldEnd(chunk, ...args);
  };

  next();
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logResponseBody);

app.get("/openapi.yaml", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

app.get("/api-docs", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "swagger.html"));
});

app.use((req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.info("REQUEST:", `${req.method}-${req.url}`);
  next();
});
// Подключаем новый корневой роутер из src/routes
app.use(apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.json({ status: "ERROR", message: err.message });
});

export default app;

