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
