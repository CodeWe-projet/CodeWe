/**
 * Express router providing index related routes
 * @module routes/legal
 * @author Alexandre Dewilde
 * @date 16/11/2020
 * @version 1.0.0
 * @requires express
 * 
 */

 /**
 * express module
 * @const
 */
const express = require('express');
const config = require('../config/config');
/**
 * Express router.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * Route serving termsofservice
 * @name get/termsofservice
 * @function
 * @memberof modules:routes/legal
 * @inner
 */
router.get(['/tos', '/tac', '/termsofservice', '/terms-of-service'], (req, res) => {
    res.render('legal/tos.html', {document: document, production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

/**
 * Route serving privacy policy
 * @name get/privacy
 * @function
 * @memberof modules:routes/legal
 * @inner
 */
router.get(['/privacy', '/privacy-policy', '/privacypolicy'], (req, res) => {
    res.render('legal/privacy.html', {document: document, production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

/**
 * Route serving licence
 * @name get/licence
 * @function
 * @memberof modules:routes/legal
 * @inner
 */
router.get('/license', (req, res) => {
    res.render('legal/licence.html', {document: document, production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

module.exports = router;