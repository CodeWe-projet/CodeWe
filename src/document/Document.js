module.exports = class Document {

    constructor (documentContent) {
        this.documentContent = documentContent;
    }

    setLine (uuid, content) {
        // Choose the right line in content and modify it
        this.documentContent.splice(this.findIndexUuid(uuid), 1, {uuid: uuid, content: content});
    }

    newLine (previousUuid, uuid, content) {
        // insert a line a the right place
        // TODO bug with lot of lines added
        let id = this.findIndexUuid(previousUuid);
        if (this.documentContent.length > id) {
            this.documentContent.splice(id + 1, 0, {uuid: uuid, content: content});
        }
        else {
            this.documentContent.push({uuid: uuid, content: content});
        }

    }

    deleteLine (uuid) {
        // find the right uuid and delete of the list
        this.documentContent.splice(this.findIndexUuid(uuid), 1);
    }

    findIndexUuid (uuid) {
        let index;
        this.documentContent.some((item, i) => {
            index = i;
            return item.uuid === uuid;
        });
        return index
    }

    applyRequests (requests) {
        // apply methods to object according to a lists of requests
        requests.forEach(request => {
            let requestType = request.type;
            let data = request.data;
            switch (requestType) {
                case 'set-line':
                    this.setLine(data.id, data.content);
                    break;
                case 'new-line':
                    this.newLine(data.previous, data.id, data.content);
                    break;
                case 'delete-line':
                    this.deleteLine(data.id);
                    break;
            }
        });
    }
}