const socket = io();

function joinRoom(doc_id) {
    let text = document.getElementById("editor").innerText;
    socket.emit("join", {room: doc_id, text: text});
}

function updateDocument(doc_id) {
    let text = get_code();
    socket.emit("update text", {room: doc_id, text: text});
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let editor = document.getElementById('editor');

let spaces = '';
function initSpaces(tab_size){
    spaces = '';
    for (let i = 0; i < tab_size; i++) {
        spaces += ' ';
    }
}

initSpaces(4);

editor.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 9: // tab
            e.preventDefault();
            let selection = window.getSelection();
            selection.collapseToStart();
            let range = selection.getRangeAt(0);
            range.insertNode(document.createTextNode(spaces));
            selection.collapseToEnd();
            break;
        case 13: // enter
            //console.log('New line');
            //console.log(e);
            //e.preventDefault();
            break;
    }
});

function get_it(){
    if(document.getElementById("header").classList.contains("blur")){
        document.getElementById("header").classList.remove("blur");
    }
    if(document.getElementById("editor").classList.contains("blur")){
        document.getElementById("editor").classList.remove("blur");
    }
    document.getElementById("welcome").style.display = "None";
    setCookie("welcome", "true", 30);
}

if(getCookie('welcome') === ""){
    if(!document.getElementById("header").classList.contains("blur")){
        document.getElementById("header").classList.add("blur");
    }
    if(!document.getElementById("editor").classList.contains("blur")){
        document.getElementById("editor").classList.add("blur");
    }
    document.getElementById("welcome").style.display = "block";
}

joinRoom(doc_id);

socket.on("text updated", function (data) {
    update_code(data['text']);
})

function update_code(str){
    let code = '';

    str.split('\n').forEach(el => {
        code += '<div>' + el + '<br></div>';
    });

    document.getElementById('editor').innerHTML = code;
}

function get_code(){
    let str = '';

    let editor = document.getElementById('editor');

    let children = editor.children;
    for (let i = 0; i < children.length; i++) {
        let content = children[i].innerText;
        if(content.endsWith('\n') && i !== children.length-1){
            str += content;
        }else if(i !== children.length-1){
            str += content + '\n';
        }else{
            str += content.slice(0, -1);
        }
    }
    return str;
}