/**
 * Server
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/DB
 * 
 */

const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const socket = require('./routes/socket')(io);
const fs = require('fs');



// Server config
const configs = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const host = configs.HOST;
const port = configs.PORT;
const DEBUG = configs.DEBUG;


server.listen(port, host, () => {
    console.log('Server Started!')
});