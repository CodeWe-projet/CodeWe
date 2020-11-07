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

    send(name, content) {
        this.socket.emit(name, content);
    }

    join() {
        this.send("join", {room: this.doc_id})
    }
}

receive = data => {
    if(data['request']['type'] === 'set-line'){
        editor.update(data['request']['data']['id'], data['request']['data']['content']);
    }else if(data['request']['type'] === 'new-line'){
        editor.new_line(data['request']['data']['id'], data['request']['data']['previous'])
    }else if(data['request']['type'] === 'delete-line'){
        editor.remove_line(data['request']['data']['id'])
    }else{
        console.error(data);
    }
};

function updateElement(element) {
    socket.send("update text", {
        room: doc_id,
        request: {
            type: 'set-line',
            data: {
                id: element.getAttribute('uuid'),
                content: editor.get(element)
            }
        }
    });
}

function newElementRequest(uuid, previous_uuid){
    socket.send("update text", {
        room: doc_id,
        request: {
            type: 'new-line',
            data: {
                id: uuid,
                previous: previous_uuid
            }
        }
    });
}

function deleteElementRequest(uuid){
    socket.send("update text", {
        room: doc_id,
        request: {
            type: 'delete-line',
            data: {
                id: uuid
            }
        }
    });
}

function save(){
    socket.send("save", {
        room: doc_id,
        request: {
            type: 'save',
            data: editor.getAll()
        }
    })
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
        case 8:
            if(window.getSelection().getRangeAt(0).startOffset === 0){
                let current = get_uuid_element();
                deleteElementRequest(current.getAttribute('uuid'))
            }
            break
    }
});

keyup = (e => {
    switch (e.keyCode) {
        case 13:
            let new_element = get_uuid_element();
            let previous_element = new_element.previousElementSibling;
            let previous_uuid = previous_element.getAttribute('uuid');
            let uuid = getRandomString(10);
            new_element.setAttribute('uuid', uuid);

            newElementRequest(uuid, previous_uuid);
            updateElement(previous_element);
            updateElement(new_element);
            break
        default:
            let el = get_uuid_element();
            updateElement(el);
    }
});

socket = new Socket(doc_id, receive);
editor = new Editor('editor', 4, keyup, keydown);