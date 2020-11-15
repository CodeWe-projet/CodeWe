import Cookie from "../utils/cookie.js";
import _ from "../utils/element.js";
/**
 * This component deals with the welcome message
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */

/**
 * Class for managing welcome message
 */
export default class Welcome{
    /**
     * Initialise Welcome functions
     * @param {HTMLElement} element
     */
    constructor(element) {
        console.log(Cookie.exist('welcome'));
        if(Cookie.exist('welcome')) Welcome.hide();
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
