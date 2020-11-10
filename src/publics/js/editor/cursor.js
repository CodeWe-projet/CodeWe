import {triggerEvent, getCaretCharacterOffsetWithin, get_uuid_element} from '../utils.js';


export default class Cursor{
    
    constructor(id='editor') {
        this.id = id;
        this.editor = document.getElementById(id);
        // Listen for others caret moves
        document.addEventListener('socket.receive.cursor-moves', e => {
            // select the good line and set the cursor
            console.log(e.detail.request.data);
            let elements = this.editor.querySelectorAll('div[uuid="' + e.detail.request.data.id + '"]');
            // Insert at the right place the cursor
            // elements.forEach(element => element.innerText = element.innerText);
        });

        this.editor.addEventListener('focus', this.sendCursorPosition);
        this.editor.addEventListener('click', this.sendCursorPosition);
        this.editor.addEventListener('keydown', this.sendCursorPosition);
    }
    
    sendCursorPosition = () => {
        triggerEvent('socket.send', this.cursorRequest('Null', getCaretCharacterOffsetWithin(get_uuid_element())));
    }

    cursorRequest = (client_id, cursor_pos) => {
        let element = get_uuid_element();
        return {
            type: 'cursor-moves',
            data: {
                id: element.getAttribute('uuid'),
                client_id: client_id,
                content: cursor_pos
            }
        };
    }
}
