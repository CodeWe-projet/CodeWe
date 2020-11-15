var crypto = require('crypto');

exports.uuid =  function (i, length=5) {
    return crypto.createHash('sha256').update(i).digest('base64').substring(0, length);
}