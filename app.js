var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/userModel');
const bodyParser = require('body-parser');
var morgan = require('morgan');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const CryptoJS = require('crypto-js');

// db connect
require('./models/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(morgan('tiny'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// to provide route message in server console
app.use(logger('dev'));

// bodyparser use in app
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// static(/) public code use in app
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
// 	session({
// 		saveUninitialized: true,
// 		resave: true,
// 		secret: 'opkd8et4nlk',
// 	})
// );

// Generate a random secret key
const secretKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

// console.log('Generated secret key:', secretKey);
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: secretKey,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
		}, //100 hours
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			ttl: 24 * 60 * 60, // Session TTL in seconds (24 hours)
			autoRemove: 'native', // Remove expired sessions automatically
			crypto: {
				secret: secretKey,
			},
			touchAfter: 24 * 3600, // Update session every 24 hours (in seconds)
		}),
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware setup
app.use(flash());

// routes use in app
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
