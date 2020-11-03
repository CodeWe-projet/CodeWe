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
            console.log('New line');
            //console.log(e);
            //e.preventDefault();
            break;
    }
});
