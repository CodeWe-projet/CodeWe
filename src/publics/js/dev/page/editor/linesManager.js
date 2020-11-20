/**
 * This module deals with lines of an editable
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.0
 */
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import {createElement} from "/js/dev/utils/element.js";
import Stack from "/js/dev/utils/stack.js";
import {htmlEncode} from "/js/dev/utils/string.js";


export default class LinesManager{
    /**
     * Init lines manager
     * @param {HTMLElement} contentEditable
     */
    constructor(contentEditable) {
        this.editable = contentEditable;
        this.history = new Stack(2);
        this.change = false;
        this.getAll();
    }

    /**
     * Check if content has change
     * @return {boolean}
     */
    hasChange(){
        return this.change;
    }

    /**
     * Select element based on uuid
     * @param {string} uuid
     * @return {Element}
     */
    select(uuid){
        return document.querySelector(`[uuid='${uuid}']`);
    }

    /**
     * Get all lines content with their uuid
     * @return {[]}
     */
    getAll(){
        let elements = []
        for(let element of this.editable.children){
            if(element.hasAttribute('uuid')){
                elements.push({uuid: element.getAttribute('uuid'), content: element.innerText.replaceAll('\n', '')});
            }else{
                Debug.error('Error when trying to get all content of lines: ', element ,' has no UUID attribute.');
            }
        }
        this.history.push(elements);
        return elements;
    }

    /**
     * Update line with specified content
     * @param {string} uuid
     * @param {string} content
     */
    update(uuid, content) {
        let element = this.select(uuid);
        if(element){
            element.innerText = htmlEncode(content);
            new PrismCustom(element, 'python').apply();
        }else{
            Debug.warn(`Error when trying to update element with uuid '${uuid}': No div has this uuid.`)
        }
    }

    /**
     * Create a new line on specified position
     * @param {string} uuid
     * @param {string} previous_uuid
     * @param {string} content
     */
    new(uuid, previous_uuid, content) {
        if(this.select(uuid)){
            Debug.warn(`Children with uuid ${uuid} still exist.`);
        }else{
            const element = this.select(previous_uuid);
            element.parentNode.insertBefore(
                createElement(
                    'div',
                    content + '<br>',
                    {
                        uuid: uuid,
                    }
                ), element.nextSibling
            );
        }
    }

    /**
     * Remove a line
     * @param {string} uuid
     */
    remove(uuid) {
        let element = this.select(uuid);
        if(element) element.remove();
        else Debug.warn(`The element with uuid '${uuid}' can't be removed: it doesn't exist.`);
    }

    /**
     * Decompose lines in order and values
     * @param {[]} lines
     * @return {([]|{})[]}
     */
    decompose(lines){
        let order = [];
        let values = {};
        for(const line of lines){
            order.push(line.uuid);
            values[line.uuid] = line.content;
        }
        return [order, values];
    }

    /**
     * Return differences between two last getAll
     * @param {{}} last_requests
     * @return {[]}
     */
    getDiff(last_requests){
        const [oldOrder, oldValues] = this.decompose(this.history.get(-2));
        const [newOrder, newValues] = this.decompose(this.history.get(-1));

        let differences = [];

        for(const [i, line] of this.history.get(-1).entries()){
            if(oldOrder.includes(line.uuid)){ // intersection
                if(oldValues[line.uuid] !== line.content
                    && !(line.uuid in last_requests && last_requests[line.uuid] === line.content)){
                    differences.push(['set', [line.uuid, line.content]]);
                }
            }else{
                if(line.uuid in last_requests){
                    if(line.content !== last_requests[line.uuid]) differences.push(['set', [line.uuid, line.content]]);
                }
                else differences.push(['new', [line.uuid, this.history.get(-1)[i-1].uuid, line.content]]);
            }
        }

        for(const line of this.history.get(-2)){
            if(!newOrder.includes(line.uuid)){
                differences.push(['delete', [line.uuid]]);
            }
        }

        return differences;
    }
}
