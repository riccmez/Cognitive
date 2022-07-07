const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const http = require('http');
const config = require('./config');
const db = require('./db');
const app = express();
const server = http.Server(app);
const morgan = require('morgan');
const passport = require('passport');
const {database} = require('./keys');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('express-mongodb-session')(session);
const socketIO = require('socket.io');
const io = socketIO(server);

require('./lib/passport')

// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(flash());

//sessions 
app.use(session({
    secret: 'my secret',
    cookie: {maxAge:1000*60*60*24*7},
    store: new MongoDBStore(database),
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


app.use(require('./routes/index'));
app.use(require('./routes/registration'));

require('./sockets')(io);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server

const PORT = config.PORT;
const HOST = config.HOST;
server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`)

// sockets
