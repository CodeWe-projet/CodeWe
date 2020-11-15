const { json } = require('express');
const express = require('express');
const db = require('../db/DB');
const router = express.Router();

router.get('/:docId', async (req, res) => {
    try {
        let document = (await db.getDocument(req.params.docId));
        document['content'] = JSON.parse(document.content);
        res.render('editor.html', {document: document});
    } catch (err) {
        console.log(err);
        // TODO pass to error handler
    }
});

module.exports = router;