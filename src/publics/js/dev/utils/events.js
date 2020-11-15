/**
 * This module deals with events.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */

export default class Event{
    /**
     * Trigger an event
     * @param {string} name
     * @param {string|Object} data
     */
    static trigger(name, data){
        document.dispatchEvent(new CustomEvent(name, data));
    }

    /**
     * Trigger a custom event
     * @param {string} name
     * @param {string|Object} detail
     */
    static triggerCustom(name, detail){
        document.dispatchEvent(new CustomEvent(name, {detail: detail}));
    }
}
