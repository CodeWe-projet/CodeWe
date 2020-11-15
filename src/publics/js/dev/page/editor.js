/**
 * This module is the main script of the editor.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.0
 */
import Cursor from "/js/dev/page/editor/cursor.js";
import download from "/js/dev/page/editor/download.js";
import Editable from "/js/dev/page/editor/editable.js";
import PrismCustom from "/js/dev/page/editor/prism/prism-custom.js";
import {Socket} from "/js/dev/page/editor/socket.js";

export const socket = new Socket(doc_id);
export const editor = new Editable(document.getElementById('editor'));
export const cursor = new Cursor(document.getElementById('editor'));

for(const child of document.getElementById('editor').children){
    new PrismCustom(child, 'python').ApplyWithCaret();
}

download(document.getElementById('editor'), 'download');
