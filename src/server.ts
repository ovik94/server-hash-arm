import mongoose from "mongoose";
import app from "./app";

const mongoLogin = process.env.MONGO_LOGIN;
const mongoPwd = process.env.MONGO_PWD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;

if (!mongoLogin || !mongoPwd || !mongoHost || !mongoPort || !mongoDb) {
  // eslint-disable-next-line no-console
  console.warn(
    "MongoDB connection variables are not fully defined. Check MONGO_LOGIN/MONGO_PWD/MONGO_HOST/MONGO_PORT/MONGO_DB."
  );
}

if (mongoLogin && mongoPwd && mongoHost && mongoPort && mongoDb) {
  mongoose.connect(
    `mongodb://${mongoLogin}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`
  );
}

const port = process.env.PORT || 8082;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Listening on port " + (server.address() as any).port);
});

export default server;

