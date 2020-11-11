import {PrismCustom} from "./prism/prism-custom.js";
import {Socket} from "./socket.js";
import {Editor} from "./editor.js";



export const DEBUG = true;

const socket = new Socket(doc_id);
const editor = new Editor(document.getElementById('editor'));

for(const child of document.getElementById('editor').children){
    new PrismCustom(child, 'python').ApplyWithCaret();
}