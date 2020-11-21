/**
 * This module deals with strings.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 14/11/2020
 * @version 1.1.0
 */

/**
 * Encode HTML to safe string
 * @deprecated
 * @param {string} str
 * @return {string}
 */
export function htmlEncode(str){
    return String(str).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}


/**
 * Insert string in another at the specified position
 * @param {string} text
 * @param {string} addon
 * @param {number} position
 * @return {string}
 */
export function insertInText(text, addon, position){
    return text.slice(0,position) + addon + text.slice(position);
}
