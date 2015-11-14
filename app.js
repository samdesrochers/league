// SETUP
// =============================================================================
var express       = require('express');        
var app           = express();                 
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var mongoose      = require('mongoose');
var passport      = require('passport');
var path          = require('path');
var LocalStrategy = require('passport-local').Strategy;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({ 
    secret: 'lavaynecestlapepperonifromagedesadcarry', 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var port = process.env.PORT || 3333;

// ROUTES 
// =============================================================================
var index = require('./routes/index');
app.use('/', index);

var admin = require('./routes/admin');
app.use('/admin', admin);

var leaderboard = require('./routes/leaderboard');
app.use('/leaderboard', leaderboard);

var players = require('./routes/users');
app.use('/users', players);

var riot = require('./routes/riot');
app.use('/riot', riot);

/* Login - Register Special Routes */
var register = require('./routes/register');
app.use('/register', register);

var login = require('./routes/login');
app.use('/login', login);

// DB CONFIG
// =============================================================================
mongoose.connect('mongodb://localhost/laligue');
//mongoose.connect('mongodb://laliguedb:AJDDLozfoAk4unaPv36Qx0gl1NM3WlBmW8Apwy3sE4E-@ds052408.mongolab.com:52408/laliguedb');

// AUTH CONFIG
// =============================================================================
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// ERROR HANDLING
// =============================================================================
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// RUN 
// =============================================================================
app.listen(port);

module.exports = app;