/**
 * This module deals with strings.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
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
