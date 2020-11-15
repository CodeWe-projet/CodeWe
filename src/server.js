const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const socket = require('./routes/socket')(io);


// TODO configure for https and socket io for https
// TODO deal with error


server.listen(5000, () => {
    console.log('Server Started!')
});