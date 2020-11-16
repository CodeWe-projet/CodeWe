/**
 * This module deals with tabs.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.0
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
        console.log(this);
    }

    /**
     * Change size of tab
     * @param {number} size
     */
    setSize(size){
        if(this.type === TabType.TAB){
            this.size = size;
            if(!this.size) this.size = 8;
            this.element.style.tabSize = this.size + 'px';
        }else if(this.type === TabType.SPACES){
            this.size = size;
            if(!this.size) this.size = 4;
            console.log(this.size, size);
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
     */
    getCompletion(position){
        if(this.type === TabType.SPACES) return ' '.repeat(this.size-position%this.size);
        else if(this.type === TabType.TAB) return '\t';
    }

    /**
     * Return spaces based on position
     * @param {number} position
     */
    getCompletionSize(position){
        if(this.type === TabType.SPACES) return this.size-position%this.size;
        return 1;
    }
}
