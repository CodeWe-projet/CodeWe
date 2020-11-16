/**
 * Socket routes
 * @module routes/socket
 * @author Alexandre Dewilde
 * @date 16/11/2020
 * @version 1.0.0
 * 
 */
 /**
 * DB module
 * @type {object}
 * @const
 */
const db = require('../db/DB');
/**
 * Document module
 * @type {object}
 * @const
 */
const Document = require('../document/Document');

const utils = require('../utils');

const rooms = {};

module.exports = function (wss) {
	// TODO catch error handle disconnection etc
	// Based on https://stackoverflow.com/a/62867363
  	wss.on('connection', socket => {

		const uuid = utils.uuid(Math.random());

		const leave = room => {
			if(! rooms[room][uuid]) return;
			// if the one exiting is the last one, destroy the room
			if(Object.keys(rooms[room]).length === 1) delete rooms[room];
			else delete rooms[room][uuid];
		};

		socket.on('message', async data => {
			switch (data.event) {
				case 'update':
					try {
						Object.entries(rooms[data.room]).forEach(([, sock]) => sock.send({ data }));
						let documentContent = (await db.getDocument(data["room"])).content;
						documentContent = JSON.parse(documentContent);
						let document = new Document(documentContent);
						document.applyRequests(data["requests"]);
						db.updateDocument(data["room"], JSON.stringify(document.documentContent));
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
			}
		});

		socket.on('close', data => {
			Object.keys(rooms).forEach(room => leave(room));
		});
  	}); 
}