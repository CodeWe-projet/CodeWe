const { MongoClient, ObjectID } = require("mongodb");
var crypto = require('crypto');
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
    constructor (url) {
        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async connect () {
        try {
            this.db = await this.client.connect();
            this.codeWe = await this.db.db('codewe');
            this.documentsCollection = await this.codeWe.collection('codewe');
            this.usersCollection = await this.codeWe.collection('users');
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error with db connection');
            }
            throw new Error(err);
        }
    }

    async createDocument (language) {
        let doc = {
            content: baseCode,
            creationDate: Date.now(),
            lastViewedDate: Date.now(),
            customDocumentName: '',
            documentOwner: '',
            editors: [],
            documentLink: '',
            linkView: '',
            language: language,
            tab: 4
        };
        try {
            let results = (await this.documentsCollection.insertOne(doc));
            const documentLink = utils.uuid(results.insertedId.toString());
            const linkView = utils.uuid(documentLink);
            this.documentsCollection.updateOne({_id: results.insertedId}, {$set: {documentLink: documentLink, linkView: linkView}});
            return documentLink;
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when creating a new document');
            }
        }

    }

    async getDocument (documentLink) {
        try {
            return await this.documentsCollection.findOne({documentLink: documentLink});
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when fetching document');
            }
        }
    }

    async createUser(userId, secretToken) {
        try {
            await this.usersCollection.insertOne({
                    userId: userId,
                    secretToken: crypto.createHash('sha256').update(secretToken).digest('base64')
            });
            return 'Success';
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when creating user');
            }
        }
    }

    async checkUserSecretToken(userId, secretToken) {
        try {
            const user = await this.usersCollection.findOne({userId: userId});
            return (user.secretToken == crypto.createHash('sha256').update(secretToken).digest('base64'));
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when checking user secret token');
            }
            return 'Error';
        }
    }

    async setLine (documentLink, uuid, content) {
        try {
            await this.documentsCollection.updateOne({documentLink: documentLink, 'content.uuid': uuid}, {$set: {'content.$.content': content.slice(0, 5000)}});
            return 'Succes';
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when changing line content');
            }
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
            if (index) {
                this.documentsCollection.updateOne({documentLink: documentLink}, {
                    $push: {
                        content: {
                            $each : [{uuid: uuid, content: content.slice(0, 5000)}],
                            $position : index + 1
                        }
                    }
                });
            }
            return 'Succes';
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when adding a new line to document');
            }
        }
    }

    async deleteLine (documentLink, uuid) {
        try {
            // Delete line at the right place
            await this.documentsCollection.updateOne({documentLink: documentLink}, {$pull: {content: {uuid: uuid}}});
            return 'Succes';
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when deleting a line in document');
            }
        }

    }

    async changeParam(documentLink, param, newValue) {
        try {
            const update = {};
            update[param] = newValue;
            await this.documentsCollection.updateOne({documentLink: documentLink}, {$set: update});
            return 'Succes';
        } catch (err) {
            if (configs.DEBUG) {
                console.error(err);
            }
        }
    }

    async changeCustomName(documentLink, newName) {
        return this.changeParam(documentLink, 'customDocumentName', newName);
    }

    async changeTabSize(documentLink, newTabSize) {
        if (Number.isInteger(newTabSize)) {
            return this.changeParam(documentLink, 'tab', newTabSize);
        }
    }

    async changeLanguage(documentLink, newLanguage) {
        if (["python"].includes(newLanguage)) {
            return this.changeParam(documentLink, 'language', newLanguage);
        }
    }

    async addNewEditors(documentLink, newEditorsId) {
        try {
            await this.documentsCollection.updateOne({documentLink: documentLink}, {$addToSet: {editors: newEditorsId}});
            return 'Success';
        } catch (err) {
            if (configs.DEBUG) {
                console.error(error);
            }
        }
    }

    async updateLastViewedDate(documentLink) {
        return this.changeParam(documentLink, 'lastViewedDate', Date.now());
    }

    async deleteOldDocuments(days) {
        const oldTimestamp = Date.now() - 1000 * 60 * 60 * 24 * days;
        return this.documentsCollection.deleteMany({'lastViewedDate': {$lt : oldTimestamp} });
    }

    async applyRequests (documentLink, requests) {
        // TODO look to use bulk write
        let success = true;
        try {
            // Avoid too many requests
            requests = requests.slice(0, 50);
            for (let request of requests) {
                let requestType = request.type;
                let data = request.data;
                switch (requestType) {
                    case 'set-line':
                        let results = await this.setLine(documentLink, data.id, data.content);
                        if (!results) success = false;
                        break;
                    case 'new-line':
                        let results = await this.newLine(documentLink, data.previous, data.id, data.content);
                        if (!results) success = false;
                        break;
                    case 'delete-line':
                        let results = await this.deleteLine(documentLink, data.id);
                        if (!results) success = false;
                        break;
                }
            }
            return success;
        } catch (err) {
            if (configs.DEBUG) {
                console.error('Error when applying requests');
            }
        }
    }
}

function getDB () {
    db = new MongoDB(configs.DB_URL);
    db.connect();
    return db;
}

module.exports = getDB();
