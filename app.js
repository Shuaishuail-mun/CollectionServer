var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config');

require('mongoose').connect(
    `mongodb://${config.mongoDB.host}:${config.mongoDB.port}/${config.mongoDB.database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

var usersRouter = require('./routes/users');
var movieRouter = require('./routes/movie');
var articleRouter = require('./routes/articles');
var commentRouter = require('./routes/comments');
var favoredRouter = require('./routes/favored');

var app = express();
app.use(cors({credentials: true, origin: "http://localhost:3006"}));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movie', movieRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/favored', favoredRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
