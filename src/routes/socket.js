const db = require('../db/DB');
const Document = require('../document/Document');


module.exports = function (io) {
    // TODO deal with error
    io.sockets.on('connection', (socket) => {
        socket.on('join', (data) => {
            socket.join(data.room);
        });

        socket.on('update text', async (data) => {
            socket.to(data.room).emit('text updated', data);
            let documentContent = (await db.getDocument(data["room"])).content;
            documentContent = JSON.parse(documentContent);
            let document = new Document(documentContent);
            document.applyRequests(data["requests"]);
            db.updateDocument(data["room"], JSON.stringify(document.documentContent));
        });

        socket.on('save', (data) => {
            db.updateDocument(data.room, JSON.stringify(data.requests[0].data));
        });
    });
}