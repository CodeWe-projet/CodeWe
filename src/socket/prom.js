const client = require('prom-client');

const timestamp_uptime = new client.Gauge({
    name: 'timestamp_uptime',
    help: 'timestamp uptime',
});
timestamp_uptime.set(Date.now());

const connexions = new client.Counter({
    name: 'connexions',
    help: 'connexions',
});

const connected = new client.Gauge({
    name: 'connected',
    help: 'connected',
});

const total_packets = new client.Counter({
    name: 'total_packets',
    help: 'total_packets',
});

const total_packets_size = new client.Counter({
    name: 'total_packets_size',
    help: 'total_packets_size',
});

const total_new_documents = new client.Counter({
    name: 'total_new_documents',
    help: 'total_new_documents',
});

const total_new_lines = new client.Counter({
    name: 'total_new_lines',
    help: 'total_new_lines',
});

const active_rooms = new client.Gauge({
    name: 'active_rooms',
    help: 'active_rooms',
});

const unique_connected = new client.Gauge({
    name: 'unique_connected',
    help: 'unique_connected',
});

/*
const unique_connexions = new client.Counter({
    name: 'unique_connexions',
    help: 'unique_connexions',
});
*/

module.exports = {
    timestamp_uptime,
    connexions,
    connected,
    total_packets,
    total_packets_size,
    total_new_documents,
    total_new_lines,
    active_rooms,
    unique_connected,
    //unique_connexions,
};
