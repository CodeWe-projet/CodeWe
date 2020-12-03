/**
 * This module is the main script of the editor.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.1
 */
import Customize from "/js/dev/component/custom.js";
import Cursor from "/js/dev/page/editor/cursor.js";
import download from "/js/dev/page/editor/download.js";
import Editable from "/js/dev/page/editor/editable.js";
import {patterns} from "/js/dev/page/editor/prism/patterns.js";
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";
import EditorSocket from "/js/dev/page/editor/socket.js";
import _ from "/js/dev/utils/element.js";
import qrCode from "/js/dev/utils/qrcode/qrcode-m-2.js";

export const socket = new EditorSocket(doc_id);
export const editor = new Editable(_.id('editor'));
export const cursor = new Cursor(_.id('editor'));

download(_.id('download'), _.id('editor'));

if(!Object.keys(patterns).includes(language)) language = 'generic';

for(const child of _.id('editor').children){
    new PrismCustom(child, language).apply();
}

export const customize = new Customize(editor);

qrCode('qrcode', document.documentURI.replace('/editor/', '/e/'));

const title = document.getElementById('header').getElementsByTagName('h1').item(0);
title.innerHTML += ' - ' + doc_id;
title.parentElement.style.width = '500px';
