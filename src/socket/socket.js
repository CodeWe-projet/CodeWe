/**
 * Socket routes
 * @module socket/socket
 * @author Alexandre Dewilde
 * @date 16/11/2020
 * @version 1.0.0
 *
 */
const discordWebhook = require('webhook-discord');
const debug = require('debug');
const config = require('../config/config');

 /**
 * MongoDB module
 * @type {object}
 * @const
 */
const db = require('../db/MongoDB');

const utils = require('../utils');

const rooms = {};

const hook = config.DISCORD_WEBHOOK ? new discordWebhook.Webhook(config.DISCORD_WEBHOOK) : null;

module.exports = function (wss) {
	// TODO catch error handle disconnection etc
	// Based on https://stackoverflow.com/a/62867363
  	wss.on('connection', socket => {
		socket.isAlive = true;
		const uuid = utils.uuid(Math.random().toString());

		const leave = room => {
			if(! rooms[room][uuid]) return;
			// if the one exiting is the last one, destroy the room
			if(Object.keys(rooms[room]).length === 1) delete rooms[room];
			else delete rooms[room][uuid];
		};
		socket.leave = leave;


		socket.on('message', async data => {
			data = JSON.parse(data);
			if(!('uuid' in data)) data['uuid'] = 'None';
			switch (data.event) {
				case 'update':
					try {
						Object.entries(rooms[data.room]).forEach(([, sock]) => {
							if(sock === socket) {
								sock.send(JSON.stringify({
									code: "OK",
									uuid: data['uuid'],
									time: Date.now(),
								}));
							}else sock.send(JSON.stringify(data));
						});
						db.applyRequests(data.room, data.data);
					} catch (err) {
						throw new Error(err);
					}
					break;
				case 'join':
					if (data.room in rooms)  {
						rooms[data.room][uuid] = socket;
					}
					else {
						rooms[data.room] = {};
						rooms[data.room][uuid] = socket;
					}
					break;
				case 'ping':
					socket.send('pong');
					break;
				case 'pong':
					socket.isAlive = true;
					break;
				case 'report': // Send issue to hook
					if (hook) {
						hook.warn('Report', data.data.content);
					}

			}
		});

		socket.on('pong', () => {
			socket.isAlive = true;
		});

		socket.on('error', (err) => {
			debug(err);
		});

		socket.on('close', data => {
			Object.keys(rooms).forEach(room => leave(room));
		});
	  });
	  // FROM ws doc
	  const interval = setInterval(function ping() {
		wss.clients.forEach(function each(socket) {
			if (socket.isAlive === false) {
				Object.keys(rooms).forEach(room => socket.leave(room));
				return socket.terminate();
			}
			socket.isAlive = false;
			socket.ping();
		});
	  }, 30000);

	  wss.on('close', function close() {
		clearInterval(interval);
	  });


}
