/**
 * This module deals with tabs.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 27/11/2020
 * @version 1.1.0
 */


/**
 * Enumeration of possible tab types
 * @type {{TAB: number, SPACES: number}}
 */
export const TabType = {
    TAB: 0,
    SPACES: 1
}


export default class Tab{
    /**
     * Init Tab object
     * @param {HTMLElement} element
     * @param {number} type
     * @param {number|null} size
     */
    constructor(element, type=TabType.SPACES, size=null) {
        this.element = element;
        this.oldSize = size || 4;
        this.set(type, size);
        console.log(this);
    }

    /**
     * Change type and size of tab
     * @param {number} type
     * @param {number|null} size
     */
    set(type, size=null){
        this.type = type;
        this.setSize(size);
    }

    /**
     * Change size of tab
     * @param {number} size
     */
    setSize(size){
        this.oldSize = this.size;
        if(this.type === TabType.TAB){
            this.size = size;
            if(!this.size) this.size = 8;
            this.element.style.tabSize = this.size + 'px';
        }else if(this.type === TabType.SPACES){
            this.size = size;
            if(!this.size) this.size = 4;
            this.element.style.tabSize = this.size*2 + 'px';
        }else{
            this.size = size;
            this.element.style.tabSize = 'inherit';
        }
    }

    /**
     * Return spaces based on size
     * @return {string}
     */
    get(){
        if(this.type === TabType.SPACES) return ' '.repeat(this.size);
        else if(this.type === TabType.TAB) return '\t';
    }

    /**
     * Return spaces based on position
     * @param {number} position
     * @return {string}
     */
    getCompletion(position){
        if(this.type === TabType.SPACES) return ' '.repeat(this.size-position%this.size);
        else if(this.type === TabType.TAB) return '\t';
    }

    /**
     * Return spaces based on position
     * @param {number} position
     * @return {number}
     */
    getCompletionSize(position){
        if(this.type === TabType.SPACES) return this.size-position%this.size;
        return 1;
    }

    /**
     * Update text based on oldSize
     * @param {string} text
     * @return {string}
     */
    updateText(text){
        const current = Math.max(text.search(/\S/), 0);
        const amount = ~~(current/this.oldSize) * this.size + current%this.oldSize;
        return ' '.repeat(amount) + text.slice(current)
    }
}
