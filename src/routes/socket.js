/**
 * Socket routes
 * @module routes/socket
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires ../document/Document
 * @requires ../db/DB
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


module.exports = function (io) {
    io.sockets.on('connection', (socket) => {
        socket.on('join', (data) => {
            try {
                socket.join(data.room);
            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('update text', async (data) => {
            socket.to(data.room).emit('text updated', data);
            try {
                let documentContent = (await db.getDocument(data["room"])).content;
                documentContent = JSON.parse(documentContent);
                let document = new Document(documentContent);
                document.applyRequests(data["requests"]);
                db.updateDocument(data["room"], JSON.stringify(document.documentContent));
            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('save', (data) => {
            try {
                db.updateDocument(data.room, JSON.stringify(data.requests[0].data));
            } catch (err) {
                throw new Error(err);
            }
            
        });
    });
}