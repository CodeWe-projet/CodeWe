/**
 * Express router providing index related routes
 * @module routes/index
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/DB
 * 
 */

  /**
 * express module
 * @const
 */
const express = require('express');
 /**
 * DB module
 * @const
 * @type {object}
 */
const db = require('../db/DB');
/**
 * Express router.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * Route serving editorindex page
 * @name get/
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.get('/', (req, res) => {
    res.render('index.html');
});

/**
 * Route to create a new document
 * @name post/create_document
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.post('/create_document', async (req, res) => {
    try {
        let documentId = await db.createDocument();
        res.redirect(`/editor/${documentId}`);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
});

/**
 * Route serving termsofservice
 * @name get/termsofservice
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.get(['/tos', '/tac', '/termsofservice', '/terms-of-service'], (req, res) => {
    res.render('legal/tos.html');
});

/**
 * Route serving privacy policy
 * @name get/privacy
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.get(['privacy', 'privacy-policy', 'privacypolicy'], (req, res) => {
    res.render('legal/privacy.html');
});

/**
 * Route serving licence
 * @name get/licence
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.get('license', (req, res) => {
    res.render('legal/licence.html');
});


module.exports = router;