import Config from "/js/dev/config.js";
import _, {getCurrentNode, getNodeFromAttribute} from "/js/dev/utils/element.js";
import EventManager from "/js/dev/utils/events.js";
import Random from "/js/dev/utils/random.js";

export default class Cursor{
    /**
     * Constructor of Cursor class. Init everything for this class.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.editor = element;

        this.current = new Map();

        this.color = Random.randInt(0, 255, 3);
        this.uuid = Random.string(10);
        this.request = {};

        // Listen for others caret moves
        document.addEventListener('socket.receive.cursor-moves', e => {
            this.update(e);
        });

        document.dispatchEvent(new CustomEvent('socket.preprocess', {detail: [this.sendCursorPosition, [this]]}));

        this.editor.addEventListener('focus', () => {
            if(getCurrentNode() === this.editor) return;
            this.request = this.cursorRequest();
        });
        this.editor.addEventListener('click', () => {
            if(getCurrentNode() === this.editor) return;
            this.request = this.cursorRequest();
        });
        this.editor.addEventListener('keypress', () => {
            if(getCurrentNode() === this.editor) return;
            this.request = this.cursorRequest();
        });

    }

    cursorRequest(){
        let element = getNodeFromAttribute('uuid');
        for(const entry of this.current.entries()){
            if(entry[0] !== this.uuid && entry[1][1] === element) return {};
        }
        if (element.hasAttribute('uuid')) {
            return {
                type: 'cursor-moves',
                data: {
                    uuid: element.getAttribute('uuid'),
                    userId: this.uuid,
                    color: this.color
                }
            };
        }
        return {};
    }

    sendCursorPosition(cursor){
        const request = cursor.request;
        if(cursor && Object.keys(request).length > 0){
            EventManager.triggerCustom('socket.send', {request});
            cursor.request = {};
        }
    }

    /**
     * Update the pointer position depending on gived data.
     * @param {Object.<string, string | Array>} ev
     */
    update(ev){
        const data = ev.detail.request.data;
        if(this.current.has(data.userId)){
            this.current.get(data.userId)[0].remove();
            this.current.get(data.userId)[1].removeAttribute('contenteditable');
            this.current.get(data.userId)[1].classList.remove('noteditable');
            this.current.delete(data.userId);
        }

        const element = document.querySelector('div[uuid="' + data.uuid + '"]');

        if(element === null){
            if(Config.isDebug()) console.log('Cursor position doesn\'t exist');
            return;
        }

        const pointer = document.createElement('div');
        pointer.classList.add('pointer');
        pointer.style.top = element.offsetTop + 'px';
        pointer.style.backgroundColor = 'rgb(' + data.color[0] + ', ' + data.color[1] + ', ' + data.color[2] + ')'
        if(Config.isDebug()) pointer.id = Random.string(20);
        _.id('body').appendChild(pointer);

        element.setAttribute('contenteditable', 'false');
        element.classList.add('noteditable');

        setTimeout(() => {
            if(this.current.has(data.userId) && Date.now() - this.current.get(data.userId)[2] > 9000){
                this.current.get(data.userId)[0].remove();
                this.current.get(data.userId)[1].removeAttribute('contenteditable');
                this.current.get(data.userId)[1].classList.remove('noteditable');
                this.current.delete(data.userId);
            }
        }, 10000);

        this.current.set(data.userId, [pointer, element, Date.now()]);
    }

}
