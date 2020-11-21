/**
 * This component deals with the welcome message
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.1
 */

import Cookie from "/js/dev/utils/cookie.js";
import _ from "/js/dev/utils/element.js";

/**
 * Class for managing welcome message
 */
export default class Welcome{
    /**
     * Initialise Welcome functions
     * @param {HTMLElement} element
     */
    constructor(element) {
        if(Cookie.exist('welcome') || document.documentURI.includes('/legal/')) Welcome.hide();
        else Welcome.show();
        element.addEventListener('click', Welcome.hideWithCookie);
    }
    /**
     * hide the welcome message
     */
    static hide(){
        _.id('main').classList.remove('blur-background');
        _.id("welcome").style.display = "None";
    }

    /**
     * hide the welcome message and set the cookie
     */
    static hideWithCookie(){
        Welcome.hide();
        Cookie.set('welcome', 'true', 90);
    }

    /**
     * Displays the welcome message
     */
    static show(){
        _.id('main').classList.add('blur-background')
        _.id("welcome").style.display = "block";
    }
}
