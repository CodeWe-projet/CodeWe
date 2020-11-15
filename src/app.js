const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const logger = require('morgan');
const index = require('./routes/index')
const editor = require('./routes/editor')

const app = express();
app.disable("x-powered-by");

// Configure views folder
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// Adding middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set static folder
app.use(express.static(path.join(__dirname, 'static')));

// Configure routes
app.use('/', index);
app.use('/editor', editor);


// 404 error
app.use((req, res, next) => {
    res.status(404);
    res.render('404.html');
})

module.exports = app;