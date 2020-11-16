/**
 * utils function
 * @module utils
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires crypto
 *
 */

var crypto = require('crypto');

/**
 * generate an id in base 64 according to the number given and length specified
 * @param  {string} i
 * @param  {int} length=5
 */
exports.uuid =  function (i, length=5) {
    return crypto.createHash('sha256').update(i).digest('base64').substring(0, length).replace('/', '0');
}
