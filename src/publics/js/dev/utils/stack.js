/**
 * This module deals with sized stack.
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.0
 */

export default class Stack{
    /**
     * Init Stack object
     * @param size
     */
    constructor(size=0) {
        this.size = size;
        this.stack = [];
    }

    /**
     * Push a new element
     * @param {*} element
     */
    push(element){
        this.stack.push(element)
        if(this.size >= 1) this.stack = this.stack.slice(-this.size);
    }

    /**
     * Get the nth element
     * @param {number} n
     * @return {*}
     */
    get(n){
        if(n<0) return this.stack[this.stack.length+n];
        return this.stack[n];
    }
}

export class WaitingStack{
    /**
     * Init waitingStack object
     * @param size
     */
    constructor(size) {
        this.size = size;
        this.stack = {};
        this.old = new Stack(size);
    }

    /**
     * Push a new element
     * @param {string} uuid
     * @param {*} data
     */
    push(uuid, data){
        this.stack[uuid] = data;
    }

    /**
     * Get the element with the given uuid
     * @param {string} uuid
     * @return {*}
     */
    get(uuid){
        return this.stack[uuid];
    }

    /**
     * Append a new element in the stack
     * @param {string} uuid
     * @param {*} data
     */
    add(uuid, data){
        this.push(uuid, {
            send: Date.now(),
            data: data,
        })
    }

    /**
     * Archive an element
     * @param {string} uuid
     * @param {number|null} server_time
     * @param {number|null} time
     */
    archive(uuid, server_time, time=null){
        const content = this.stack[uuid];
        delete this.stack[uuid];
        content['server'] = server_time;
        content['received'] = time ? time: Date.now();
        this.old.push(content);
    }

    /**
     * Get all elements in stack
     * @return {{}}
     */
    getAll(){
        return this.stack;
    }

    /**
     * Return the size of current stack
     * @return {*}
     */
    getSize(){
        return Object.keys(this.stack).length;
    }
}
