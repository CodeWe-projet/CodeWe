/**
 * This module deals with the cookies.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 14/11/2020
 * @version 1.0.0
 */

export default class Cookie{
    /**
     * Set the value of the cookie depending on data given
     * @param {string} name
     * @param {string} value
     * @param {number} days
     */
    static set(name, value, days){
        const date = new Date(Date.now() + (days*24*60*60*1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    /**
     * Check if the cookie exist
     * inspired from https://stackoverflow.com/a/25617724/11247647
     * @param {string} name
     * @return
     */
    static exist(name){
        return document.cookie.match(new RegExp("^(.*;)?\\s*" + name + "\\s*=\\s*[^;]+(.*)?$"));
    }

    /**
     * Get an existing cookie from name or return default value
     * @param {string} name
     * @param {Object} defaultValue
     * @returns {string | Object}
     */
    static get(name, defaultValue=undefined){
        name += "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++){
            let c = ca[i];
            while (c.charAt(0) === ' '){
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0){
                return c.substring(name.length, c.length);
            }
        }
        return defaultValue;
    }

}
