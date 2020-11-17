/**
 * This module is the main script of the editor.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.1
 */
import Cursor from "/js/dev/page/editor/cursor.js";
import download from "/js/dev/page/editor/download.js";
import Editable from "/js/dev/page/editor/editable.js";
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";
import EditorSocket from "/js/dev/page/editor/socket.js";
import _ from "/js/dev/utils/element.js";

export const socket = new EditorSocket(doc_id);
export const editor = new Editable(_.id('editor'));
export const cursor = new Cursor(_.id('editor'));

for(const child of _.id('editor').children){
    new PrismCustom(child, 'python').ApplyWithCaret();
}

download(_.id('download'), _.id('editor'));
