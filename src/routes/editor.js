/**
 * Express router providing editor related routes
 * @module routes/editor
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/MangoDB
 * @requires ../config/config
 * 
 */

 /**
 * express module
 * @const
 */
const express = require('express');
/**
 * DB module
 * @type {object}
 * @const
 */
const db = require('../db/MongoDB');

const config = require('../config/config');
/**
 * Express router.
 * @type {object}
 * @const
 */
const router = express.Router();


/**
 * Route serving editor with document id specified
 * @name get/:docId
 * @function
 * @memberof modules:routes/editor
 * @inner
 */
router.get('/:docId', async (req, res) => {
    try {
        let document = (await db.getDocument(req.params.docId));
        if (document) {
            document['content'] = document.content;
            document.document_id = req.params.docId;
            res.render('editor.html', {document: document, production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
        }
        else {
            res.status(404).render('404.html', {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE})
        }
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = router;