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
const languages = require('../config/langages');
const config = require('../config/config');

const prom = require('./prom');

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
	// Based on https://stackoverflow.com/a/62867363
  	wss.on('connection', socket => {
  		prom.connexions.inc();
		socket.isAlive = true;
		const uuid = utils.uuid(Math.random().toString());

		const broadcastRoomExceptSender = (data, event, valueEvent) => {
			Object.entries(rooms[data.room]).forEach(([, sock]) => {
				if(sock === socket) {
					const backValue = {
						code: "OK",
						time: Date.now(),
					};
					backValue[event] = valueEvent;
					sock.send(JSON.stringify(backValue));
				}else sock.send(JSON.stringify(data));
			});
		}

		const leave = room => {
			if(! rooms[room][uuid]) return;
			// if the one exiting is the last one, destroy the room
			if(Object.keys(rooms[room]).length === 1) delete rooms[room];
			else delete rooms[room][uuid];
		};
		socket.leave = leave;


		socket.on('message', async data => {
			prom.total_packets.inc();
			data = JSON.parse(data);
			if(!('uuid' in data)) data['uuid'] = 'None';
			switch (data.event) {
				case 'update':
					try {
						// let document = db.getDocument(data.room);
						// if (document.public || (document.editors.include(userId) and db.checkUsersSecretToken(userId, secretToken)))
						broadcastRoomExceptSender(data, 'uuid', data.uuid);
						const succesUpdatingDate = db.updateLastViewedDate(data.room);
						const succesUpdate = db.applyRequests(data.room, data.data);
						// /!\ Bad event
						// if (!succesUpdatingDate || !succesUpdate) socket.send(JSON.stringify({event: 'update', success: false}));
					} catch (err) {
						if (config.DEBUG) {
							console.error(err);
						}
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

				case 'language':
					try {
						let success = false;
						if (languages.includes(data.language)) {
							broadcastRoomExceptSender(data, 'language', data.language);
							success = db.changeLanguage(data.room, data.language);
						}
						if (!success) socket.send(JSON.stringify({event: 'language', success: false}));
					} catch (err) {
						if (config.DEBUG) {
							console.error(err);
						}
					}
					break;
				case 'changeTabSize':
					try {
						let success = false;
						if (Number.isInteger(newTabSize)) {
							broadcastRoomExceptSender(data, 'tabSize', data.tabSize);
							success = db.changeTabSize(data.room, data.tabSize);
						}
						if (!success) socket.send(JSON.stringify({event: 'changeTabSize', success: false}));
					} catch (err) {
						if (config.DEBUG) {
							console.error(err);
						}
					}
					break;
				case 'changeCustomName':
					try {
						broadcastRoomExceptSender(data, 'customName', data.customName);
						let success = db.changeCustomName(data.customName);
						if (!success) socket.send(JSON.stringify({event: 'changeCustomName', success: false}));
					} catch (err) {
						if (config.DEBUG) {
							console.error(err);
						}
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
						hook.warn('Report', data.data.content.slice(0, 5000));
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

	setInterval(() => {
		prom.connected.set(wss.clients.size);
	}, 5000);

	// delete old documents
	setInterval(() => {
		db.deleteOldDocuments(config.DAYS_TO_DELETE_DOCUMENT);
	}, 1000 * 60 * 60 * 24);


}
