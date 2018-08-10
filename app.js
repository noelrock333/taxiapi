if (!process.env.NODE_ENV) {
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripsRouter = require('./routes/trips');
var driversRouter = require('./routes/drivers');
var vehiclesRouter = require('./routes/vehicles');
var serviceTypesRouter = require('./routes/service_types');
var organizationsRouter = require('./routes/organizations');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next){
  res.io = io;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/service_types', serviceTypesRouter);
app.use('/api/organizations', organizationsRouter);

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

io.on('connection', socket => {
  socket.on('joinToDrivers', driver_id => {
    socket.join('drivers');
    socket.join(`driver-${driver_id}`);
  });

  socket.on('joinToUsers', user_id => {
    socket.join('users');
    socket.join(`user-${user_id}`);
  });
});

module.exports = {
  app: app,
  server: server
};
