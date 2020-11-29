/**
 * App
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 */

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const nunjucks = require('nunjucks');
const path = require('path');
const minify = require('express-minify');
const logger = require('morgan');
const compression = require('compression');
const fs = require('fs');
const index = require('./routes/index');
const editor = require('./routes/editor');
const legal = require('./routes/legal');
const config = require('./config/config');
const ssl = config.SSL;

const app = express();
app.disable("x-powered-by");

if (ssl) {
    app.use('*', function (req, res, next) {
        if (req.secure) {
            next();
        } else {
            const target = (req.headers.host.includes(':') ? req.headers.host.split(':')[0] : req.headers.host) + ':' + config.PORT;
            res.redirect('https://' + target + req.url);
        }
    });
}

// Configure views folder
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

// logger files
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Adding middleware
if (config.PRODUCTION) {
    app.use(logger('combined', { stream: accessLogStream }));
    app.use(compression());
}
else {
    app.use(logger('dev'));
}
app.use(minify({ jsMatch: false }));

const store = new MongoDBStore({
    uri: config.DB_URL,
    databaseName: 'codewe',
    collection: 'sessions'
});

// Configure session
const sessionParser = session({
    secret: 'secret-key',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        secure: false
    },
    store: store,
    resave: true,
    saveUninitialized: false
});

app.use(sessionParser);


//app.use(secure);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Set static folder
app.use(express.static(path.join(__dirname, 'publics/')));

// Configure routes
app.use('/', index);
app.use('/editor', editor);
app.use('/legal', legal);

// 404 error
app.all('*', (req, res) => {
    res.status(404).render('404.html', {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

// Handle errors
app.use((error, req, res, next) => {
    if (config.DEBUG) {
        console.error(error);
    }
    res.sendStatus(500);
});

module.exports = {
    app,
    sessionParser
}
