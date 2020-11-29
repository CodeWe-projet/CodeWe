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
const {nanoid} = require('nanoid');
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

const utils = require('../utils');

/**
 * Route serving editor with document id specified
 * @name get/:docId
 * @function
 * @memberof modules:routes/editor
 * @inner
 */

router.get('/:docId', async (req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = nanoid(20);
        req.session.ownDocuments = [];
        req.session.editorOfDocuments = [];
    }
    try {
        let document = (await db.getDocument(req.params.docId));
        if (document && (req.session.ownDocuments.includes(req.params.docId) || req.session.editorOfDocuments.includes(req.params.docId) || document.public == true || document.public == undefined)) {
            document.document_id = req.params.docId;
            res.render('editor.html', {document: document, production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
        }
        else if (!document) {
            res.status(404).render('404.html', {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE})
        }
        else {
            res.send(401);
        }
    } catch (err) {
        next(err);
    }
});

router.get('/join/:joinLink', async (req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = nanoid(20);
        req.session.ownDocuments = [];
        req.session.editorOfDocuments = [];
    }
    try {
        const docId = await db.joinFromLink(req.params.joinLink, req.session.userId);
        if(docId) {
            req.session.editorOfDocuments.push(docId);
            res.redirect(`/editor/${docId}`);
        }
        else res.status(404).render('404.html',  {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
    } catch (err) {
        if (config.DEBUG) {
            console.log(err);
        }
        next(err);
    }
});

module.exports = router;