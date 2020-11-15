/**
 * This module deals with DOM elements.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */

/**
 * Shortcuts for the most frequently used selection functions
 */
export default class _{
    /**
     * Select element by id
     * @param {string} elementId
     * @return {HTMLElement}
     */
    static id(elementId){
        return document.getElementById(elementId);
    }

    /**
     * Select elements by class name
     * @param {string} className
     * @return {HTMLCollectionOf<Element>}
     */
    static class(className){
        return document.getElementsByClassName(className);
    }

    /**
     * Select element by attribute value
     * @param name
     * @param value
     * @return {Element}
     */
    static attribute(name, value){
        return document.querySelector('[' + name + '"' + value + '"]')
    }
}

/**
 * Get the current Node
 * @return {Node}
 */
export function getCurrentNode(){
    if(window.getSelection().rangeCount === 0) return undefined;
    return window.getSelection().getRangeAt(0).startContainer;
}

/**
 * Return parent with specified attribute
 * @param {string} attribute
 * @param {HTMLElement} child
 * @return {Node|undefined}
 */
export function getNodeFromAttribute(attribute, child=getCurrentNode()){
    try{
        if(child.nodeType !== Node.TEXT_NODE && child.hasAttribute(attribute)) return child;
        else return get_uuid_element(child.parentElement);
    }catch (e){
        return undefined;
    }
}

/**
 * Return parent with one of the specified types names
 * @param {Array} types
 * @param {Node} child
 * @return {Node}
 */
export function getParentFromSpecificTypes(types, child=getCurrentNode()){
    try{
        if(types.includes(child.nodeName)) return child;
        else return getParentFromSpecificTypes(types, child.parentElement);
    }catch (e){
        return undefined;
    }
}
