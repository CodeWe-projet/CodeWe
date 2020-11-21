/**
 * App
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 */

const express = require('express');
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
const promBundle = require("express-prom-bundle");
//const secure = require('express-force-https');

const app = express();
app.disable("x-powered-by");

// Configure views folder
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

// logger files
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Adding middleware
if (config.PRODUCTION) {
    app.use(logger('combined', { stream: accessLogStream }));
    app.use(compression());
}
else {
    app.use(logger('dev'));
}
app.use(minify({ jsMatch: false }));

// Prometheus middleware
// TODO new middleware
if(config.METRICS){
    app.use(promBundle({
        includeMethod: true,
        includePath: true,
    }));
}

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

module.exports = app;
