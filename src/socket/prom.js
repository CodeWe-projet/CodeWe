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

module.exports = { timestamp_uptime, connexions, connected, total_packets };
