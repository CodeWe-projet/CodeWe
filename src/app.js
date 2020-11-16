/**
 * App
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/DB
 * 
 */

const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const logger = require('morgan');
const index = require('./routes/index');
const editor = require('./routes/editor');
const legal = require('./routes/legal');

const app = express();
app.disable("x-powered-by");

// Configure views folder
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Adding middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set static folder
app.use(express.static(path.join(__dirname, 'publics/')));

// Configure routes
app.use('/', index);
app.use('/editor', editor);
app.use('/legal', legal);


// 404 error
app.all('*', (req, res) => {
    res.status(404).render('404.html');
});

// Handle errors
app.use((err, req, res, next) => {
    res.sendStatus(500);
});

module.exports = app;