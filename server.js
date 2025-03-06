const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const mongoLogin = process.env.MONGO_LOGIN;
const mongoPwd = process.env.MONGO_PWD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;

mongoose.connect(
  `mongodb://${mongoLogin}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`
);

const logResponseBody = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (chunk, ...args) => {
    chunks.push(chunk);
    return oldWrite.apply(res, [chunk, ...args]);
  };

  res.end = (chunk, ...args) => {
    if (chunk) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString("utf8");
    console.info("RESPONSE:", `${req.method}-${req.url}`, body);
    return oldEnd.apply(res, [chunk, ...args]);
  };

  next();
};

app.use('/images', express.static('public/images'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logResponseBody);
app.use((req, res, next) => {
  console.info("REQUEST:", `${req.method}-${req.url}`);
  next();
});

app.use(require("./routes"));

app.use((req, res, next) => {
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

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handling
app.use(function (err, req, res, next) {
  res.json({ status: "ERROR", message: err.message });
});

const server = app.listen(process.env.PORT || 8082, () =>
  console.log("Listening on port " + server.address().port)
);
