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
var cron = require("node-cron");
const firebase = require('./firebase');

const Trip = require('./models/trip');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripsRouter = require('./routes/trips');
var driversRouter = require('./routes/drivers');
var vehiclesRouter = require('./routes/vehicles');
var serviceTypesRouter = require('./routes/service_types');
var organizationsRouter = require('./routes/organizations');
var passwordResetRouter = require('./routes/password_reset');
var adminRouter = require('./routes/admin');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());
app.use(function(req, res, next){
  res.io = io;
  res.sendPushNotification = sendPushNotification;
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
app.use('/api/admin', adminRouter);
app.use('/api/password_reset', passwordResetRouter);

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

cron.schedule("0 */5 * * * *", function() {
  console.log('Clear old trips');
  clearTrips();
});

function clearTrips() {
  new Trip()
    .query(function(qb) {
      qb.whereRaw("age(now(), created_at) > '10 minutes'");
    })
    .where({ status: 'holding' })
    .fetchAll({ withRelated: 'user' })
    .then(trips => {
      if (trips) {
        var oldTrips = trips.toJSON();
        var oldTripsIds = oldTrips.map(item => item.id)
        
        console.log('Removing old trips', oldTripsIds);

        oldTrips.forEach(trip => {
          firebase
            .database()
            .ref('server/holding_trips/')
            .child(trip.id)
            .remove();
          sendPushNotification({ 
            token: trip.user.device_id,
            title: 'Lo sentimos',
            body: 'Tu servicio ha excedido el tiempo de espera'
          });
        })

        if (oldTripsIds.length > 0) {
          new Trip()
            .query(qb => {
              qb.whereIn('id', oldTripsIds) 
            }).save({ status: 'canceled' }, { patch: true});
        }
      }
    });
}

function sendPushNotification(options) {
  console.log('sendPushNotification');
  if (options.token && options.title && options.body) {
    var message = {
      notification: {
        title: options.title,
        body: options.body,
      },
      android: {
        ttl: 540000, // 9 minutes
        priority: 'high',
        notification: {
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      },
      token: options.token
    };

    firebase.messaging().send(message)
      .then((resp) => {
        console.log('Message sent successfully:', resp);
      }).catch((err) => {
        console.log('Failed to send the message:', err);
      });
  }
}

module.exports = {
  app: app,
  server: server
};
