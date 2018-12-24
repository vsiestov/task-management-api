const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const constants = require('./modules/helpers/constants.module');

require('dotenv-flow').config();

const api = require('./routes/api');

app = express();

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', api);

app.use((error, req, res, next) => {
  const status = constants.codes.INVALID_ARGUMENTS;

  if (error && error.errors && error.errors instanceof Array) {
    return res.status(status).send(error);
  }

  return next(error);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {
  };

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
