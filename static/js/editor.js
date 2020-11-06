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

    get(element) {
        if(element.innerText.endsWith('\n')){
            return element.innerText.slice(0, -1);
        }else{
            return element.innerText;
        }
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
    }else{
        console.log(data);
    }
};

function updateDocument(element) {
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

keydown = (e => {
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
        case 13: // enter
            //console.log('New line');
            //console.log(e);
            //e.preventDefault();
            break;
    }
});

keyup = (e => {
    let el = window.getSelection().focusNode.parentElement;
    updateDocument(el);
});

socket = new Socket(doc_id, receive);
editor = new Editor('editor', 4, keyup, keydown);