import {PrismCustom} from "./prism/prism-custom.js";
import {get_uuid_element, triggerEvent} from "../utils.js";

export class Editor{
    constructor(id='editor', tabSize=4) {
        this.id = id;
        this.editor = document.getElementById(id);
        this.tabSize = tabSize;

        this.editor.addEventListener('keyup', e => {
            new PrismCustom(get_uuid_element(), 'python').ApplyWithCaret();

            switch (e.keyCode) {
                case 13: // enter
                    let new_element = get_uuid_element();
                    let previous_element = new_element.previousElementSibling;
                    let previous_uuid = previous_element.getAttribute('uuid');
                    let uuid = getRandomString(10);
                    new_element.setAttribute('uuid', uuid);

                    let n_spaces = previous_element.innerText.search(/\S/);
                    if(previous_element.innerText.endsWith(':')) n_spaces += this.tabSize;
                    if(n_spaces < 0) n_spaces = 0;

                    new_element.insertBefore(document.createTextNode(' '.repeat(n_spaces)), new_element.firstChild);

                    triggerEvent('socket.send', this.request.newLine(uuid, previous_uuid));
                    triggerEvent('socket.send', this.request.setLine(previous_element));
                    triggerEvent('socket.send', this.request.setLine(new_element));

                    break
                default:
                    triggerEvent('socket.send', this.request.setLine(get_uuid_element()));
            }
        });

        this.editor.addEventListener('keydown', e => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode === 83) {
                save();
                e.preventDefault();
                return;
            }
            switch (e.keyCode) {
                case 9: // tab
                    e.preventDefault();
                    let selection = window.getSelection();
                    selection.collapseToStart();
                    let range = selection.getRangeAt(0);
                    //TODO Spaces
                    range.insertNode(document.createTextNode('    '));
                    selection.collapseToEnd();
                    break;
                case 8: // backspace / delete
                    if(window.getSelection().getRangeAt(0).startOffset === 0){
                        let current = get_uuid_element();

                        triggerEvent('socket.send', this.request.deleteLine(current.getAttribute('uuid')));
                    }
                    break
            }
        });

        document.addEventListener('socket.receive.set-line', e => {
            this.update(e.detail.request['data']['id'], e.detail.request['data']['content']);
        });

        document.addEventListener('socket.receive.new-line', e => {
            this.new_line(e.detail.request['data']['id'], e.detail.request['data']['previous']);
        });

        document.addEventListener('socket.receive.delete-line', e => {
            this.remove_line(e.detail.request['data']['id']);
        });

        class Request {
            constructor(editor) {
                this.editor = editor;
            }

            setLine(element) {
                return {
                    type: 'set-line',
                    data: {
                        id: element.getAttribute('uuid'),
                        content: this.editor.get(element)
                    }
                };
            }

            newLine(uuid, previous_uuid){
                return {
                    type: 'new-line',
                    data: {
                        id: uuid,
                        previous: previous_uuid
                    }
                };
            }

            deleteLine(uuid){
                return {
                    type: 'delete-line',
                    data: {
                        id: uuid
                    }
                };
            }

            save(){
                return {
                    type: 'save',
                    data: this.editor.getAll()
                };
            }
        }

        this.request = new Request(this);
    }

    update(uuid, content) {
        let elements = this.editor.querySelectorAll('div[uuid="' + uuid + '"]');
        elements.forEach(element => element.innerText = content);
    }

    new_line(uuid, previous_uuid) {
        let element = this.editor.querySelector('div[uuid="' + previous_uuid + '"]');
        let div = document.createElement("div");
        div.setAttribute("uuid", uuid);
        div.innerHTML = "<br>";
        element.parentNode.insertBefore(div, element.nextSibling);
    }

    remove_line(uuid) {
        let element = this.editor.querySelector('div[uuid="' + uuid + '"]');
        element.remove();
    }

    get(element) {
        if(element.innerText.endsWith('\n')){
            return element.innerText.slice(0, -1);
        }else{
            return element.innerText;
        }
    }

    getAll(){
        let elements = []
        for(let element of this.editor.children){
            elements.push([element.getAttribute('uuid'), element.innerText.replaceAll('\n', '')]);
        }
        return elements;
    }
}