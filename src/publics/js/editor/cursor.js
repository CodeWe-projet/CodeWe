import {getCurrentElement, triggerEvent, getCaretCharacterOffsetWithin, get_uuid_element} from '../utils.js';


export default class Cursor{
    
    constructor(element) {
        this.editor = element;
        // Listen for others caret moves
        document.addEventListener('socket.receive.cursor-moves', e => {
            // select the good line and set the cursor
            console.log(e.detail.request.data);
            let element = this.editor.querySelector('div[uuid="' + e.detail.request.data.id + '"]');
            // Insert at the right place the cursor
            let old_elements = this.editor.querySelectorAll('div[user-id="null"]');
            old_elements.forEach(element => {
                element.setAttribute('user-id', '');
                element.className = '';
            });
            element.className = 'cursor-line';
            element.setAttribute('user-id', 'null');
            // TODO randomize and keep same color
            element.style.background = 'blue'
        });

        this.editor.addEventListener('focus', this.sendCursorPosition);
        this.editor.addEventListener('click', this.sendCursorPosition);
        this.editor.addEventListener('keypress', this.sendCursorPosition);
    }
    
    sendCursorPosition = () => {
        triggerEvent('socket.send', this.cursorRequest());
    }

    cursorRequest = () => {
        let element = get_uuid_element();
        return {
            type: 'cursor-moves',
            data: {
                id: element.getAttribute('uuid'),
                content: getCaretCharacterOffsetWithin(element)
            }
        };
    }
}
