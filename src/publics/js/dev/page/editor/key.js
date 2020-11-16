/**
 * This module deals with KeyCode values.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 15/11/2020
 * @version 2.0.0
 */

export default class Key{
    /**
     * Keys of which do not interpret pushes
     */
    static extraKeys = [9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145, 225];

    /**
     * Return if the code has to be interpret
     * @param {number} keyCode
     * @return {boolean}
     */
    static isExtra(keyCode){
        return this.extraKeys.includes(keyCode);
    }

    /**
     * Return the right Ctrl key based on user platform
     * @param {KeyboardEvent} event
     * @return {boolean}
     */
    static ctrl(event){
        return window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey;
    }
}
