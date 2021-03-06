var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var config = require('./config'),
 users = require('./routes/users');

var indexRouter = require('./routes/index'),
 usersRouter = require('./routes/users'),
 dishRouter = require('./routes/dishRouter'),
 leaderRouter = require('./routes/leaderRouter'),
 promoRouter = require('./routes/promoRouter'),
 uploadRouter = require('./routes/uploadRouter'),
 favoriteRouter = require('./routes/favoriteRouter');

const Dishes = require("./models/dishes");

const url = config.mongoUrl;
  mongoose = require('mongoose')
  connect = mongoose.connect(url)

connect.then((db) => {
  console.log('Connected Successfully to server!');
}, (err) => { console.log(err);});

var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('./favorites', favoriteRouter);

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
