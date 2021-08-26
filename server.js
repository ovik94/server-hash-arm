const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling
app.use(function(err, req, res, next) {
  res.json({ status: "ERROR", message: err.message });
});

const server = app.listen(process.env.PORT || 3000, () => console.log('Listening on port ' + server.address().port));