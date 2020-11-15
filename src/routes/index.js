const express = require('express');
const db = require('../db/DB');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index.html');
});


router.post('/create_document', async (req, res) => {
    try {
        let documentId = await db.createDocument();
        res.redirect(`/editor/${documentId}`);
    } catch (err) {
        // TODO pass to error handler
    }
});


router.get(['/tos', '/tac', '/termsofservice', '/terms-of-service'], (req, res) => {
    res.render('legal/tos.html');
});


router.get(['privacy', 'privacy-policy', 'privacypolicy'], (req, res) => {
    res.render('legal/privacy.html');
});

router.get('license', (req, res) => {
    res.render('legal/licence.html');
});


module.exports = router;