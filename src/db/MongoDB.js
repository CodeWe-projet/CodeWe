const { MongoClient, ObjectID } = require("mongodb");
const configs = require('../config/config');
const utils = require('../utils');

const baseCode = [
    {uuid: utils.uuid(Math.random().toString(), 10), content: 'def main(text: str) -> None:'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: '    print(text)'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: ''},
    {uuid: utils.uuid(Math.random().toString(), 10), content: 'if __name__ == \'__main__\':'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: '    main(\'Hello World !\')'}
];


class MongoDB {
    // TODO handle error
    // TODO change using BULK write
    constructor (username, password, host, database, port) {
        const url = `mongodb://${username}:${password}@${host}:${port}/?retryWrites=true&w=majority`;
        this.client = new MongoClient(url);
    }

    async connect () {
        this.db = await this.client.connect();
        this.codeWe = await this.db.db('codewe');
        this.documentsCollection = await this.codeWe.collection('codewe');
    }

    async createDocument () {
        let doc = {
            content: baseCode,
            creationDate: Date.now(),
            lastViewedDate: Date.now(),
            customDocumentName: '',
            documentOwner: '',
            editors: [],
            linkEdit: '',
            linkView: '',
            language: '',
            tab: 4
        };
        // TODO check if inseted etc
        let results = (await this.documentsCollection.insertOne(doc));
        return results.insertedId.toString();

    }

    async getDocument (id) {
        return await this.documentsCollection.findOne({_id: ObjectID(id)});
    }

    async setLine (documentId, uuid, content) {
        await this.documentsCollection.updateOne({_id: ObjectID(documentId), 'content.uuid': uuid}, {$set: {'content.$.content': content}});
    }

    async newLine (documentId, previousUuid, uuid, content) {
        // Insert a line at the right place
        //TODO is it possible in one operation ? 
        // TODO is it possible to implement with bulk?
        let doc = await this.documentsCollection.findOne({_id: ObjectID(documentId)});
        let index = doc.content.findIndex(line => {
            return line.uuid == previousUuid;
        });
        this.documentsCollection.updateOne({_id: ObjectID(documentId)}, {
            $push: {
                content: {
                    $each : [{uuid: uuid, content: content}],
                    $position : index + 1
                }
            }
        });
    }

    async deleteLine (documentId, uuid) {
        // Delete line at the right place
        await this.documentsCollection.updateOne({_id: ObjectID(documentId)}, {$pull: {content: {uuid: uuid}}});

    }

    async applyRequests (documentId, requests) {
        // TODO use bulk write instead of this slow methods
        for (let request of requests) {
            let requestType = request.type;
            let data = request.data;
            switch (requestType) {
                case 'set-line':
                    await this.setLine(documentId, data.id, data.content);
                    break;
                case 'new-line':
                    await this.newLine(documentId, data.previous, data.id, data.content);
                    break;
                case 'delete-line':
                    await this.deleteLine(documentId, data.id);
                    break;
            }
        };
    }
}

function getDB () {
    db = new MongoDB(
        configs.DB_CONFIG.DB_USERNAME,
        configs.DB_CONFIG.DB_PASSWORD,
        configs.DB_CONFIG.DB_HOST,
        configs.DB_CONFIG.DB_DATABASE,
        configs.DB_CONFIG.DB_PORT
    );
    db.connect();
    return db
}

module.exports = getDB();
