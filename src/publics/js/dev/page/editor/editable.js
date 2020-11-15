import temporaryCardAlert from "/js/dev/component/text-alert.js";
import Config from "/js/dev/config.js";
import {extraKeys} from "/js/dev/page/editor/keys.js";
import PrismCustom from "/js/dev/page/editor/prism/prism-custom.js";
import Request from "/js/dev/page/editor/requests.js";
import Tab from "/js/dev/page/editor/tab.js";
import Caret from "/js/dev/utils/caret.js";
import {getNodeFromAttribute, getParentFromSpecificTypes} from "/js/dev/utils/element.js";
import EventManager from "/js/dev/utils/events.js";
import Random from "/js/dev/utils/random.js";
import {htmlEncode} from "/js/dev/utils/string.js";
/**
 * This module deals with tabs
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.0
 */

export default class Editable{
    constructor(element) {
        this.editable = element;
        this.tab = new Tab(element);




        this.lines = this.getAll();
        this.last_request = {};
        this.hasChange = false;
        this.keepSpace = false;
        document.dispatchEvent(new CustomEvent('socket.preprocess', {detail: [this.applyDiff, [this]]}));

        this.editable.addEventListener('keyup', e => {
            if(extraKeys.includes(e.keyCode)) return;

            switch (e.keyCode) {
                case 13: // Enter
                    try{
                        this.keepSpace = false;
                        let new_element = getNodeFromAttribute('uuid');
                        let previous_element = new_element.previousElementSibling;
                        let uuid = Random.string(10);
                        new_element.setAttribute('uuid', uuid);

                        let n_spaces = previous_element.innerText.search(/\S/);
                        if(previous_element.innerText.trimEnd().endsWith(':')) n_spaces += this.tab.getCompletion(n_spaces);
                        if(n_spaces < 0) n_spaces = 0;

                        new_element.innerHTML = ' '.repeat(n_spaces) + new_element.innerHTML;

                        if(new_element.innerText.length === 0) new_element.innerHTML = '<br>';

                        Caret.setPosition(new_element, n_spaces);
                    }catch (error){
                        if(Config.DEBUG) console.log('Can\'t apply "space" : error during execution')
                    }
                    break;
                default:
                    if(!e.ctrlKey && !e.altKey) new PrismCustom(getNodeFromAttribute('uuid'), 'python').ApplyWithCaret();
            }

            this.hasChange = true;
        });

        this.editable.addEventListener('paste', e => {
            const s = document.getSelection();
            function canPaste(lines){
                if(!getParentFromSpecificTypes(['div', 'section']).hasAttribute('uuid')) return false;
                if(getParentFromSpecificTypes(['div', 'section'], s.anchorNode) !== getParentFromSpecificTypes(['div', 'section'], s.focusNode)) return false;
                return lines.length === 1 || (s.anchorNode === s.focusNode && s.anchorOffset === s.focusOffset);
            }

            let paste = (e.clipboardData || window.clipboardData).getData('text');
            if(paste){
                const lines = paste.split('\n');
                if(canPaste(lines)){
                    if(lines.length > 1){
                        const currentElement = getNodeFromAttribute('uuid');
                        e.preventDefault();
                        currentElement.innerHTML += lines[0];
                        new PrismCustom(currentElement, 'python').apply();
                        let currentUuid = currentElement.getAttribute('uuid');
                        for(let i=1;i<lines.length;i++){
                            let nextUuid = Random.string(10);
                            this.new_line(
                                nextUuid,
                                currentUuid,
                                lines[i]
                            )
                            new PrismCustom(this.editable.querySelector('div[uuid="' + nextUuid + '"]'), 'python').apply();
                            currentUuid = nextUuid;
                        }
                    }
                }else{
                    e.preventDefault();
                    temporaryCardAlert('Paste Event', 'Sorry, you can\'t past over a multiline selection' , 5000);
                }
            }else{
                e.preventDefault();
                temporaryCardAlert('Paste Event', 'Error with content of your clipboard', 5000);
            }
        });

        this.editable.addEventListener('keydown', e => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode === 83) {
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('socket.send_now', {detail: {requests: [Request.save(this.getAll())], name: 'save'}}));
                temporaryCardAlert('Save', 'Your document has been saved', 5000, "#228b22");
                return;
            }

            if([9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145, 225].includes(e.keyCode)) return;

            const anchorParent = getParentFromSpecificTypes(['div', 'section'], document.getSelection().anchorNode);
            const focusParent =  getParentFromSpecificTypes(['div', 'section'], document.getSelection().focusNode);
            if(!anchorParent.hasAttribute('uuid')
                || !focusParent.hasAttribute('uuid')
                || ((Caret.getBeginPosition(getNodeFromAttribute('uuid')) === 0
                    || Caret.getEndPosition(getNodeFromAttribute('uuid')) === 0)
                    ) && anchorParent !== focusParent){
                e.preventDefault();
                temporaryCardAlert('Override', 'Sorry, you can\'t override the first char of this line', 5000);
                return;
            }

            switch (e.keyCode) {
                case 9: // tab
                    e.preventDefault();
                    let selection = window.getSelection();
                    selection.collapseToStart();
                    let range = selection.getRangeAt(0);
                    range.insertNode(document.createTextNode(this.tab.getCompletion(Caret.getBeginPosition(getNodeFromAttribute('uuid')))));
                    selection.collapseToEnd();
                    new PrismCustom(getNodeFromAttribute('uuid'), 'python').ApplyWithCaret();
                    break;
                case 13: // enter
                    if(Config.DEBUG && this.keepSpace) console.log('Prevent add new line (key is probably maintain)');
                    if(this.keepSpace) e.preventDefault();
                    else this.keepSpace = true;
                    break;
                case 8: // suppr
                    if(getParentFromSpecificTypes(['div', 'section']).hasAttribute('uuid') && Caret.getBeginPosition(getNodeFromAttribute('uuid')) === 0){
                        e.preventDefault();
                        const currentSibling = getNodeFromAttribute('uuid');
                        let previousSibling = getNodeFromAttribute('uuid').previousSibling;
                        while(previousSibling && previousSibling.nodeType !== 1) {
                            previousSibling = previousSibling.previousSibling;
                        }
                        if(previousSibling !== null){
                            const len = previousSibling.innerText.length;
                            previousSibling.innerHTML += currentSibling.innerHTML;
                            currentSibling.remove();
                            Caret.setPosition(previousSibling, len);
                        }
                    }
                    break;
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
    }

    update(uuid, content) {
        let element = this.editable.querySelector('div[uuid="' + uuid + '"]');
        element.innerText = htmlEncode(content);
        new PrismCustom(element, 'python').apply();
    }

    new_line(uuid, previous_uuid, content) {
        if(this.editable.querySelectorAll('div[uuid="' + uuid + '"]').length > 0){
            if(Config.DEBUG) console.log(uuid + ' div still exist')
            return;
        }
        let element = this.editable.querySelector('div[uuid="' + previous_uuid + '"]');
        let div = document.createElement("div");
        div.setAttribute("uuid", uuid);
        div.innerHTML = content + '<br>';
        // new PrismCustom(div, 'python').apply();
        element.parentNode.insertBefore(div, element.nextSibling);
    }

    remove_line(uuid) {
        let element = this.editable.querySelector('div[uuid="' + uuid + '"]');
        if(element) element.remove();
        else if(Config.DEBUG) console.log('The element with uuid \'' + uuid + '\' can\'t be removed: it still doesn\'t exist');
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
        for(let element of this.editable.children){
            elements.push({uuid: element.getAttribute('uuid'), content: element.innerText.replaceAll('\n', '')});
        }
        return elements;
    }

    applyDiff(editor){
        if(editor.hasChange){
            const oldLines = editor.lines;
            editor.lines = editor.getAll();
            EventManager.triggerCustom('socket.send', {requests: editor.checkDiff(oldLines, editor.lines)});
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
                if(oldValues[line.uuid] !== line.content) reqs.push(Request.setLine(line.uuid, line.content));
            }else{
                reqs.push(Request.newLine(line.uuid, newLines[i-1].uuid, line.content));
            }
        }
        for(const line of oldLines){
            if(!newOrder.includes(line.uuid)){
                reqs.push(Request.deleteLine(line.uuid));
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
