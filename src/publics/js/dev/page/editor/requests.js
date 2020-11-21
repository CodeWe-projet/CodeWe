/**
 * This module deals with editable requests.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.0
 */

export default class Request{
    static setLine(uuid, content) {
        return {
            type: 'set-line',
            data: {
                id: uuid,
                content: content
            }
        };
    }

    static newLine(uuid, previous_uuid, content){
        return {
            type: 'new-line',
            data: {
                id: uuid,
                previous: previous_uuid,
                content: content
            }
        };
    }

    static deleteLine(uuid){
        return {
            type: 'delete-line',
            data: {
                id: uuid
            }
        };
    }

    static save(lines){
        return {
            type: 'save',
            data: lines
        };
    }
}
