/**
 * Server
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/DB
 * 
 */
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const configs = require('./config/config');
// Server config
const host = configs.HOST;
const port = configs.PORT;
const DEBUG = configs.DEBUG;
const ssl = configs.SSL;
const sslKeyPath = configs.KEY_FILE_SSL;
const sslCertPath = configs.CERT_FILE_SSL; 

const options = ssl ? {
    key: fs.readFileSync(path.join(__dirname, sslKeyPath), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, sslCertPath), 'utf8')
} : null;

const app = require('./app');
const server = ssl ? require('https').createServer(options, app) : require('http').createServer(app);

// config websockets
const wss = new WebSocket.Server({ server });
require('./socket/socket')(wss);



server.listen(port, host, () => {
    console.log('Server Started!')
});
