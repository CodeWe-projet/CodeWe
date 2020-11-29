/**
 * Server
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
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
const metrics = configs.METRICS;
const sslKeyPath = configs.KEY_FILE_SSL;
const sslCertPath = configs.CERT_FILE_SSL;

// Read necessary file for ssl when active
const options = ssl ? {
    key: fs.readFileSync(sslKeyPath.startsWith('/') ? sslKeyPath : path.join(__dirname, sslKeyPath), 'utf8'),
    cert: fs.readFileSync(sslCertPath.startsWith('/') ? sslCertPath : path.join(__dirname, sslCertPath), 'utf8')
} : null;


const {app, sessionParser} = require('./app');
const config = require('./config/config');


const http = ssl ? require('https') : require('http');
const server = http.createServer(options, app);

// When ssl active this redirect REDIRECT PORT TO PORT
// For example 80 -> 443 
if (ssl && configs.REDIRECT_PORT !== null) {
    require('http').createServer(app).listen(configs.REDIRECT_PORT, host, () => {
        console.log(`http requests from ${configs.REDIRECT_PORT} are redirected to https on ${configs.PORT}`);
    });
}

// config websockets
const wss = new WebSocket.Server({ noServer: true });


server.on('upgrade', (request, sock, head) => {
    sessionParser(request, {}, () => {
        if (!request.session.userId) {
            sock.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            sock.destroy();
        }

        wss.handleUpgrade(request, sock, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
});

require('./socket/socket')(wss);

// Start the server
server.listen(port, host, () => {
    console.log(`Server Started on ${host}:${port}`);
});

// Run metrics server
if (metrics) {
    const {metricsApp} = require('./metricsApp');
    const metricsServer = require('http').createServer(metricsApp);
    metricsServer.listen(config.METRICS_PORT);
}
