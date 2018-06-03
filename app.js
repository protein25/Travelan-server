const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');

const indexRouter = require('./routes/index');
const informationsRouter = require('./routes/informations');
const usersRouter = require('./routes/users');
const membersRouter = require('./routes/members');
const newspeedRouter = require('./routes/newspeed');
const commentRouter = require('./routes/comment');

const informationCrawl = require('./informationCrawl');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/members',membersRouter);
app.use('/newspeed',newspeedRouter);
app.use('/informations',informationsRouter);
app.use('/comment',commentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.message);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

cron.schedule('0 * * * *', () => {
  informationCrawl(); // 매 시간 정각 마다 한번씩 신규 글이 있는지 크롤링
});

module.exports = app;
