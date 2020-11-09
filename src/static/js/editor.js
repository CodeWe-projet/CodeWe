//TODO if selection if on multiple line, only the firstone is modified.
//TODO if user delete all lines, no more div with line number.
//TODO alert errors.
//TODO request save when new client.
//TODO Only one person by line.
//TODO Reorganise.

class Editor{
    constructor(id='editor', tabSize=4, keyup= e => {}, keydown= e => {}) {
        this.id = id;
        this.editor = document.getElementById(id);
        this.tabSize = tabSize;
        this.tab = this.setTabSize(tabSize);
        this.editor.addEventListener('keydown', keydown);
        this.editor.addEventListener('keyup', keyup);
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

    setTabSize(tabSize){
        let tab = '';
        for (let i = 0; i < tabSize; i++) {
            tab += ' ';
        }
        return tab;
    }
}

class Socket{
    constructor(doc_id, receive) {
        this.doc_id = doc_id;
        this.socket = io();
        this.join();
        this.socket.on("text updated", receive);
    }

    send(name, requests, room=this.doc_id) {
        this.socket.emit(name, {
            room: room,
            requests: requests
        });
    }

    join() {
        this.send("join", {room: this.doc_id})
    }
}

receive = data => {
    for(let request of data['requests']){
        switch(request['type']){
            case 'set-line':
                editor.update(request['data']['id'], request['data']['content']);
                break;
            case 'new-line':
                editor.new_line(request['data']['id'], request['data']['previous']);
                break;
            case 'delete-line':
                editor.remove_line(request['data']['id']);
                break;
            default:
                console.error(data);
        }
    }
};

function updateElementRequest(element) {
    return {
        type: 'set-line',
        data: {
            id: element.getAttribute('uuid'),
            content: editor.get(element)
        }
    };
}

function newElementRequest(uuid, previous_uuid){
    return {
        type: 'new-line',
        data: {
            id: uuid,
            previous: previous_uuid
        }
    };
}

function deleteElementRequest(uuid){
    return {
        type: 'delete-line',
        data: {
            id: uuid
        }
    };
}

function save(){
    socket.send("save", [
        {
            type: 'save',
            data: editor.getAll()
        }
    ]);
}

function get_uuid_element(child=getCurrentElement()){
    if(child.nodeType !== Node.TEXT_NODE && child.hasAttribute('uuid')) return child;
    else return get_uuid_element(child.parentElement);
}

keydown = (e => {
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

                requests = [
                    deleteElementRequest(current.getAttribute('uuid'))
                ]

                socket.send('update text', requests);
            }
            break
    }
});

keyup = (e => {
    switch (e.keyCode) {
        case 13: // enter
            let new_element = get_uuid_element();
            let previous_element = new_element.previousElementSibling;
            let previous_uuid = previous_element.getAttribute('uuid');
            let uuid = getRandomString(10);
            new_element.setAttribute('uuid', uuid);

            let n_spaces = previous_element.innerText.search(/\S/);
            if(previous_element.innerText.endsWith(':')) n_spaces += editor.tabSize;
            if(n_spaces < 0) n_spaces = 0;

            new_element.insertBefore(document.createTextNode(' '.repeat(n_spaces)), new_element.firstChild);

            socket.send('update text', [
                newElementRequest(uuid, previous_uuid),
                updateElementRequest(previous_element),
                updateElementRequest(new_element)
            ]);

            break
        default:
            const el = get_uuid_element();
            socket.send('update text', [
                updateElementRequest(el)
            ]);
    }
});

socket = new Socket(doc_id, receive);
editor = new Editor('editor', 4, keyup, keydown);

function rainbow(block, lang){
    const prism = new Prism(patterns[lang].concat(patterns['generic']));
    block.innerHTML = prism.refract(block.innerText);
}

for(const child of document.getElementById('editor').children){
    rainbow(child, 'python');
}

/* https://jsfiddle.net/nrx9yvw9/5/ */
function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                 range.setEnd(node, chars.count);
                 chars.count = 0;
            }
        } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                   break;
                }
            }
        }
   }

   return range;
}

function setCurrentCursorPosition(element, chars) {
    if (chars >= 0) {
        let selection = document.getSelection();

        let range = createRange(element, { count: chars });

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

/* Based of https://stackoverflow.com/a/4812022/11247647 */
function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = win.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type !== "Control") {
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

editor.editor.addEventListener('keyup', e => {
    let offset = getCaretCharacterOffsetWithin(get_uuid_element());

    rainbow(get_uuid_element(), 'python');

    setCurrentCursorPosition(get_uuid_element(), offset);
});