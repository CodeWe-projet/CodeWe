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
    constructor (username, password, host, database, port) {
        const url = `mongodb://${username}:${password}@${host}:${port}/?retryWrites=true&w=majority`;
        this.client = new MongoClient(url);
    }

    async connect () {
        try {
            this.db = await this.client.connect();
            this.codeWe = await this.db.db('codewe');
            this.documentsCollection = await this.codeWe.collection('codewe');
        } catch (err) {
            console.error('Error with db connection');
            throw new Error(err);
        }
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
        try {
            let results = (await this.documentsCollection.insertOne(doc));
            const documentLink = utils.uuid(results.insertedId.toString());
            this.documentsCollection.updateOne({_id: results.insertedId}, {$set: {documentLink: documentLink}})
            return documentLink;
        } catch (err) {
            console.error('Error when creating a new document');
            throw new Error(err);
        }

    }

    async getDocument (documentLink) {
        try {
            return await this.documentsCollection.findOne({documentLink: documentLink});
        } catch (err) {
            console.error('Error when fetching document');
            throw new Error(err);
        }
    }

    async setLine (documentLink, uuid, content) {
        try {
            await this.documentsCollection.updateOne({documentLink: documentLink, 'content.uuid': uuid}, {$set: {'content.$.content': content}});
        } catch (err) {
            console.error('Error when changing line content');
            throw new Error(err);
        }
    }

    async newLine (documentLink, previousUuid, uuid, content) {
        // Insert a line at the right place
        //TODO is it possible in one operation ? 
        // TODO is it possible to implement with bulk?
        try {
            let doc = await this.documentsCollection.findOne({documentLink: documentLink});
            let index = doc.content.findIndex(line => {
                return line.uuid == previousUuid;
            });
            this.documentsCollection.updateOne({documentLink: documentLink}, {
                $push: {
                    content: {
                        $each : [{uuid: uuid, content: content}],
                        $position : index + 1
                    }
                }
            });
        } catch (err) {
            console.error('Error when adding a new line to document');
            throw new Error(err);
        }
    }

    async deleteLine (documentLink, uuid) {
        try {
            // Delete line at the right place
            await this.documentsCollection.updateOne({documentLink: documentLink}, {$pull: {content: {uuid: uuid}}});
        } catch (err) {
            console.error('Error when deleting a line in document');
            throw new Error(err);
        }

    }

    async applyRequests (documentLink, requests) {
        // TODO look to use bulk write
        try {
            for (let request of requests) {
                let requestType = request.type;
                let data = request.data;
                switch (requestType) {
                    case 'set-line':
                        await this.setLine(documentLink, data.id, data.content);
                        break;
                    case 'new-line':
                        await this.newLine(documentLink, data.previous, data.id, data.content);
                        break;
                    case 'delete-line':
                        await this.deleteLine(documentLink, data.id);
                        break;
                }
            }
        } catch (err) {
            console.error('Error when applying requests');
            throw new Error(err);
        }
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
    return db;
}

module.exports = getDB();
