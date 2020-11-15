const express = require('express');
const db = require('../db/DB');
const router = express.Router();

router.post('/download', (req, res) => {
    try {
        documentContent = await db.getDocument(req.body.doc_id);
        // TODO add header etc
        res.json(documentContent)
    } catch (err) {
        // TODO pass to error handler
    }
    
});

router.post('/create_document', (req, res) => {
    try {
        let documentId = await db.createDocument();
        // TODO add header
        res.json({doc_id: documentId});
    } catch (err) {
        // TODO pass to error handler
    }
});

router.post('/upload', (req, res) => {
    try {
        db.updateDocument(req.body.doc_id, req.body.doc_content);
    } catch (err) {
        //TODO deal with error 
    }
});