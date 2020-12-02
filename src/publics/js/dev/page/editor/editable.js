/**
 * This module deals with editable element.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 16/11/2020
 * @version 2.0.0
 */
import temporaryCardAlert from "/js/dev/component/text-alert.js";
import Key from "/js/dev/page/editor/key.js";
import LinesManager from "/js/dev/page/editor/linesManager.js";
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";
import Request from "/js/dev/page/editor/requests.js";
import Tab, {TabType} from "/js/dev/page/editor/tab.js";
import Caret from "/js/dev/utils/caret.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import {getNodeFromAttribute, getParentFromSpecificTypes} from "/js/dev/utils/element.js";
import EventManager from "/js/dev/utils/events.js";
import Random from "/js/dev/utils/random.js";
import {insertInText} from "/js/dev/utils/string.js";

export default class Editable{
    constructor(element, tabSize=initial_size) {
        this.editable = element;
        this.tab = Number.isInteger(tabSize) ? new Tab(element, TabType.SPACES, tabSize) : 4;
        this.linesManager = new LinesManager(element);
        this.last_request = {};

        this.keepSpace = false;

        /**
         * Receive all update events
         */
        document.addEventListener('socket.receive.update', e => {
            if(e && e.detail && e.detail && typeof e.detail[Symbol.iterator] === 'function'){
                for(const req of e.detail){
                    if(req.type){
                        EventManager.triggerCustom('editor.' + req.type, req.data);
                    }else{
                        Debug.warn('Trying to trigger a null received event.');
                    }
                }
            }else{
                Debug.warn('Trying to iterate on non-iterable data.');
            }
        });

        EventManager.triggerCustom('socket.preprocess', [this.coroutine, [this]]);

        /**
         * When the key is released by user
         */
        this.editable.addEventListener('keyup', e => {
            if(Key.isExtra(e.keyCode)) return;

            switch (e.keyCode) {
                case 13: // Enter
                    try{
                        this.keepSpace = false;

                        let new_element = getNodeFromAttribute('uuid');
                        let previous_element = new_element.previousElementSibling;

                        let uuid = Random.string(10);

                        new_element.setAttribute('uuid', uuid);

                        let n_spaces = previous_element.innerText.search(/\S/);
                        if(n_spaces < 0) n_spaces = 0;
                        if(previous_element.innerText.trimEnd().endsWith(':'))
                            n_spaces += this.tab.getCompletionSize(n_spaces);
                        new_element.innerHTML = ' '.repeat(n_spaces) + new_element.innerHTML;

                        Caret.setPosition(new_element, n_spaces);

                        if(new_element.innerText.length === 0)
                            new_element.innerHTML = '<br>';
                    }catch (error){
                        Debug.error('Error when trying to customize the new line');
                    }
                    break;
                default:
                    if(!e.ctrlKey && !e.altKey && getNodeFromAttribute('uuid')) PrismCustom.onCurrent(language).ApplyWithCaret();
            }
            this.linesManager.change = true;
        });

        /**
         * When user try to past content of his clipboard
         */
        this.editable.addEventListener('paste', e => {
            const s = document.getSelection();
            function canPaste(lines){
                if(!getParentFromSpecificTypes(['div', 'section']).hasAttribute('uuid')) return false;
                if(getParentFromSpecificTypes(['div', 'section'], s.anchorNode)
                    !== getParentFromSpecificTypes(['div', 'section'], s.focusNode)) return false;

                return lines.length === 1 || (s.anchorNode === s.focusNode && s.anchorOffset === s.focusOffset);
            }

            let paste = (e.clipboardData || window.clipboardData).getData('text');
            if(paste){
                const lines = paste.split('\n');
                if(canPaste(lines)){
                    if(lines.length > 1){
                        e.preventDefault();
                        this.multilinesInsert(lines);
                    }
                }else{
                    e.preventDefault();
                    Debug.debug('Prevent action when trying to paste on multiple line.');
                    temporaryCardAlert('Paste Event', 'Sorry, you can\'t past over a multiline selection' , 5000);
                }
            }else{
                e.preventDefault();
                Debug.warn('Error when trying to get the content of your clipboard.');
                temporaryCardAlert('Paste Event', 'Error with content of your clipboard', 5000);
            }
        });

        /**
         * When user push on a key in editable context
         */
        this.editable.addEventListener('keydown', e => {
            // Ctrl + S
            if (Key.ctrl(e) && e.keyCode === 83) {
                e.preventDefault();
                temporaryCardAlert('Save', 'Your document is still saved automatically', 5000, "#228b22");
                return;
            }

            if(Key.isExtra(e.keyCode)) return;

            const s = document.getSelection();

            const anchorParent = getParentFromSpecificTypes(['div', 'section'], s.anchorNode);
            const focusParent =  getParentFromSpecificTypes(['div', 'section'], s.focusNode);

            const line = getNodeFromAttribute('uuid');

            if(!line){
                e.preventDefault();
                temporaryCardAlert('Editor', 'Sorry, your action has been canceled because you are not on any line.', 5000);
                return;
            }

            if(!anchorParent.hasAttribute('uuid')
                || !focusParent.hasAttribute('uuid')
                || ((Caret.getBeginPosition(line) === 0
                    || Caret.getEndPosition(line) === 0)
                    ) && anchorParent !== focusParent){
                Caret.setRangeStart(line, 1);
            }

            switch (e.keyCode) {
                case 9: // tab
                    e.preventDefault();
                    this.insertTab();
                    break;
                case 13: // enter
                    if(e.shiftKey){
                        temporaryCardAlert('Shift+Enter', 'Please just use Enter to avoid any bugs.', 5000);
                        e.preventDefault();
                        return;
                    }
                    if(this.keepSpace){
                        Debug.debug('Prevent action when trying to add new line (key is probably maintain).');
                        e.preventDefault();
                    }else this.keepSpace = true;
                    break;
                case 8: // suppr
                    if(Caret.getBeginPosition(line) === 0){
                        e.preventDefault();
                        this.removeLine(line);
                    }
                    break;
            }
        });

        /**
         * Receive an update about the content of a line
         */
        document.addEventListener('editor.set-line', e => {
            const id = e.detail.id;
            const content = e.detail.content;
            this.last_request[id] = content;
            this.linesManager.update(id, content);
        });

        /**
         * Receive a new line to create
         */
        document.addEventListener('editor.new-line', e => {
            const id = e.detail.id;
            const previous = e.detail.previous;
            const content = e.detail.content;
            this.last_request[id] = content;
            this.linesManager.new(id, previous, content);
        });

        /**
         * Receive a line to delete
         */
        document.addEventListener('editor.delete-line', e => {
            const id = e.detail.id;
            if(id in this.last_request) delete this.last_request[id];
            this.linesManager.remove(id);
        });
    }

    /**
     * Insert a tab to current position
     */
    insertTab(){
        document.getSelection().collapseToStart();
        const range = document.getSelection().getRangeAt(0);
        range.insertNode(
            document.createTextNode(
                this.tab.getCompletion(
                    Caret.getBeginPosition(
                        getNodeFromAttribute('uuid')
                    )
                )
            )
        );
        document.getSelection().collapseToEnd();
        PrismCustom.onCurrent(language).ApplyWithCaret();
    }

    /**
     * Insert multilines
     * @param {[]} lines
     */
    multilinesInsert(lines){
        const currentElement = getNodeFromAttribute('uuid');
        currentElement.innerHTML = insertInText(currentElement.innerText, lines[0], Caret.getBeginPosition(currentElement));

        PrismCustom.onCurrent(language).apply();

        let currentUuid = currentElement.getAttribute('uuid');
        for(let i=1;i<lines.length;i++){
            let nextUuid = Random.string(10);
            this.linesManager.new(
                nextUuid,
                currentUuid,
                lines[i]
            )
            new PrismCustom(this.editable.querySelector('div[uuid="' + nextUuid + '"]'), language).apply();
            currentUuid = nextUuid;
        }
    }

    /**
     * Remove properly the current line
     * @param {HTMLElement|Node} line
     */
    removeLine(line){
        let previousSibling = line.previousSibling;
        while(previousSibling && previousSibling.nodeType !== 1) {
            previousSibling = previousSibling.previousSibling;
        }
        if(previousSibling !== null){
            const len = previousSibling.innerText.length - previousSibling.getElementsByTagName('br').length;
            previousSibling.innerHTML += line.innerHTML; //(previousSibling.innerHTML + ).replace('<br><br>', '<br>');
            for(const br of previousSibling.getElementsByTagName('br')) br.remove();
            if(previousSibling.firstChild.nodeName === 'BR'){
                console.log(`"${previousSibling.innerText}"`);
                Caret.setPosition(previousSibling.firstChild, 0);
            }else Caret.setPosition(previousSibling, len);
            line.remove();
            //new PrismCustom(previousSibling, language).ApplyWithCaret();
        }
    }

    /**
     * Routine executed every time the client can send a packet to the server
     * @param {Editable} editor
     */
    coroutine(editor){
        if(editor.linesManager.hasChange()){
            editor.linesManager.getAll();
            const requests = editor.makeRequestsForDiff();
            EventManager.triggerCustom('socket.send', {requests});
            editor.linesManager.change = false;
        }
    }

    /**
     * Build requests for a diffs array
     * @param {[]} diffs
     * @return {[]}
     */
    makeRequestsForDiff(diffs=this.linesManager.getDiff(this.last_request)){
        let requests = [];
        for(const diff of diffs){
            switch (diff[0]){
                case 'set':
                    requests.push(Request.setLine(...diff[1]));
                    break;
                case 'new':
                    requests.push(Request.newLine(...diff[1]));
                    break;
                case 'delete':
                    requests.push(Request.deleteLine(...diff[1]));
                    break;
            }

        }
        return requests;
    }

    /**
     * Update all syntax highlighting
     */
    updateAllHighlighting(){
        const current = getNodeFromAttribute('uuid')
        for(const child of this.editable.children){
            if(current === child) new PrismCustom(child, language).ApplyWithCaret();
            else new PrismCustom(child, language).apply();

        }
    }
}
