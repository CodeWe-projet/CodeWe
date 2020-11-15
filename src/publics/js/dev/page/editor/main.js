import {PrismCustom} from "./prism/prism-custom.js";
import {Socket} from "./socket.js";
import {Editor} from "./editor.js";
import Cursor from './cursor.js'
import {download} from "./download.js";

const socket = new Socket(doc_id);
const editor = new Editor(document.getElementById('editor'));
const cursor = new Cursor(document.getElementById('editor'));

for(const child of document.getElementById('editor').children){
    new PrismCustom(child, 'python').ApplyWithCaret();
}

download(document.getElementById('editor'), 'download');
