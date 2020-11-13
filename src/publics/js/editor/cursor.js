import {getCurrentElement, triggerEvent, getCaretCharacterOffsetWithin, get_uuid_element} from '../utils.js';
import {DEBUG} from "./main.js";

const colors = ['blue', 'red', 'brown'];
const uuid = getRandomString(10);

export default class Cursor{
    
    constructor(element) {
        this.editor = element;

        this.current = {};
        this.color = [
            Math.round(Math.random()*255),
            Math.round(Math.random()*255),
            Math.round(Math.random()*255)
        ];
        // Listen for others caret moves
        document.addEventListener('socket.receive.cursor-moves', e => {
            this.update(e.detail.request.data);
        });

        this.editor.addEventListener('focus', this.sendCursorPosition);
        this.editor.addEventListener('click', this.sendCursorPosition);
        this.editor.addEventListener('keypress', this.sendCursorPosition);
    }
    
    sendCursorPosition = () => {
        if(getCurrentElement() === this.editor) return;
        triggerEvent('socket.send', this.cursorRequest());
    }

    cursorRequest = () => {
        let element = get_uuid_element();
        if (element.hasAttribute('uuid')) {
            return {
                type: 'cursor-moves',
                data: {
                    uuid: element.getAttribute('uuid'),
                    userId: uuid,
                    color: this.color
                }
            };
        }
    }

    /**
     * Update the pointer position depending on gived data.
     * @param {Object.<string, string | Array>} data: Content of 'cursor-moves' request.
     */
    update(data){
        if(data.userId in this.current){
            this.current[data.userId].remove();
        }

        const element = document.querySelector('div[uuid="' + data.uuid + '"]');
        if(element === null){
            if(DEBUG) console.log('Cursor position doesn\' exist');
            return;
        }
        const pointer = document.createElement('div');
        pointer.classList.add('pointer');
        pointer.style.top = element.offsetTop + 'px';
        pointer.style.backgroundColor = 'rgb(' + data.color[0] + ', ' + data.color[1] + ', ' + data.color[2] + ')'
        if(DEBUG) pointer.id = getRandomString(20);
        document.getElementById('body').appendChild(pointer);
        this.current[data.userId] = pointer;
    }

}
