import {PrismCustom} from "./prism/prism-custom.js";
import {
    get_uuid_element,
    getCurrentElement,
    setCurrentCursorPosition,
    triggerMultipleEvent
} from "../utils.js";
import {DEBUG} from "./main.js";
import {htmlEncode} from "../utils";

export class Editor{
    constructor(element, tabSize=4) {
        this.editor = element;
        this.tabSize = tabSize;
        this.lines = this.getAll();
        this.last_request = {};
        this.hasChange = false;
        this.keepSpace = false;
        document.dispatchEvent(new CustomEvent('socket.preprocess', {detail: [this.applyDiff, [this]]}));

        this.editor.addEventListener('keyup', e => {
            if([9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145, 225].includes(e.keyCode)) return;

            switch (e.keyCode) {
                case 13: // Enter
                    try{
                        this.keepSpace = false;
                        let new_element = get_uuid_element();
                        let previous_element = new_element.previousElementSibling;
                        let uuid = getRandomString(10);
                        new_element.setAttribute('uuid', uuid);

                        let n_spaces = previous_element.innerText.search(/\S/);
                        if(previous_element.innerText.endsWith(':')) n_spaces += this.tabSize;
                        if(n_spaces < 0) n_spaces = 0;

                        new_element.insertBefore(document.createTextNode(' '.repeat(n_spaces)), new_element.firstChild);

                        if(n_spaces === 0) new_element.innerHTML = '<br>';

                        setCurrentCursorPosition(new_element, n_spaces);
                    }catch (error){
                        e.preventDefault();
                        if(DEBUG) console.log('Can\'t apply "space" : error during execution')
                    }
                    break;
                case 8:
                    if(getCurrentElement() === document.getElementById('editor')){
                        document.getSelection().modify('move', 'backward', 'character');
                        for(const child of document.getElementById('editor').children){
                            if(child.tagName) child.remove();
                        }
                    }
                    break;
                default:
                    new PrismCustom(get_uuid_element(), 'python').ApplyWithCaret();
            }

            this.hasChange = true;
        });

        this.editor.addEventListener('paste', e => {
            e.preventDefault();
            alert('C/C interdit !');
        });

        this.editor.addEventListener('keydown', e => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode === 83) {
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('socket.send_now', {detail: {requests: [this.request.save()], name: 'save'}}));
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
                case 13:
                    if(DEBUG && this.keepSpace) console.log('Prevent add new line (key is probably maintain)');
                    if(this.keepSpace) e.preventDefault();
                    else this.keepSpace = true;
            }
        });

        document.addEventListener('socket.receive.set-line', e => {
            this.last_request[e.detail.request['data']['id']] = e.detail.request['data']['content'];
            this.update(e.detail.request['data']['id'], e.detail.request['data']['content']);
        });

        document.addEventListener('socket.receive.new-line', e => {
            this.last_request[e.detail.request['data']['id']] = e.detail.request['data']['content'];
            this.new_line(e.detail.request['data']['id'], e.detail.request['data']['previous'], e.detail.request['data']['content']);
        });

        document.addEventListener('socket.receive.delete-line', e => {
            if(e.detail.request['data']['id'] in this.last_request) delete this.last_request[e.detail.request['data']['id']];
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

            setLineFromContent(uuid, content) {
                return {
                    type: 'set-line',
                    data: {
                        id: uuid,
                        content: content
                    }
                };
            }

            newLine(uuid, previous_uuid, content){
                return {
                    type: 'new-line',
                    data: {
                        id: uuid,
                        previous: previous_uuid,
                        content: content
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
        let element = this.editor.querySelector('div[uuid="' + uuid + '"]');
        element.innerText = htmlEncode(content);
        new PrismCustom(element, 'python').apply();
    }

    new_line(uuid, previous_uuid, content) {
        if(this.editor.querySelectorAll('div[uuid="' + uuid + '"]').length > 0){
            if(DEBUG) console.log(uuid + ' div still exist')
            return;
        }
        let element = this.editor.querySelector('div[uuid="' + previous_uuid + '"]');
        let div = document.createElement("div");
        div.setAttribute("uuid", uuid);
        div.innerHTML = content + '<br>';
        // new PrismCustom(div, 'python').apply();
        element.parentNode.insertBefore(div, element.nextSibling);
    }

    remove_line(uuid) {
        let element = this.editor.querySelector('div[uuid="' + uuid + '"]');
        if(element) element.remove();
        else if(DEBUG) console.log('The element with uuid \'' + uuid + '\' can\'t be removed: it still doesn\'t exist');
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
            elements.push({uuid: element.getAttribute('uuid'), content: element.innerText.replaceAll('\n', '')});
        }
        return elements;
    }

    applyDiff(editor){
        if(editor.hasChange){
            const oldLines = editor.lines;
            editor.lines = editor.getAll();
            triggerMultipleEvent('socket.send', editor.checkDiff(oldLines, editor.lines));
            editor.hasChange = false;
        }
    }

    checkDiff(oldLines, newLines){
        let oldOrder = [];
        let oldValues = {};
        for(const line of oldLines){
            oldOrder.push(line.uuid);
            oldValues[line.uuid] = line.content;
        }

        let newOrder = [];
        let newValues = {};
        for(const line of newLines){
            newOrder.push(line.uuid);
            newValues[line.uuid] = line.content;
        }

        let reqs = [];
        for(const [i, line] of newLines.entries()){
            if(oldOrder.includes(line.uuid)){ // intersection
                if(oldValues[line.uuid] !== line.content) reqs.push(this.request.setLineFromContent(line.uuid, line.content));
            }else{
                reqs.push(this.request.newLine(line.uuid, newLines[i-1].uuid, line.content));
            }
        }
        for(const line of oldLines){
            if(!newOrder.includes(line.uuid)){
                reqs.push(this.request.deleteLine(line.uuid));
            }
        }

        let final_reqs = [];
        let newRejectRequests = [];

        for(const req of reqs){
            if(req['type'] === 'set-line' && req['data']['id'] in this.last_request && this.last_request[req['data']['id']] === req['data']['content']) continue;
            if(req['type'] === 'new-line' && req['data']['id'] in this.last_request){
                newRejectRequests.push(req);
                continue;
            }
            final_reqs.push(req);
        }

        for(let newRequest of newRejectRequests){
            if(!final_reqs.filter(req => req['type'] === 'set-line' && req['data']['id'] === newRequest['data']['id']).length){
                delete newRequest['data']['previous'];
                newRequest['type'] = 'set-line';
                final_reqs.push(newRequest);
            }
        }

        return final_reqs;
    }
}