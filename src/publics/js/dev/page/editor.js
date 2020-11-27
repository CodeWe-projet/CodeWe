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
import {patterns} from "/js/dev/page/editor/prism/patterns.js";
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";
import EditorSocket from "/js/dev/page/editor/socket.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import _ from "/js/dev/utils/element.js";
import EventManager from "/js/dev/utils/events.js";

export const socket = new EditorSocket(doc_id);
export const editor = new Editable(_.id('editor'));
export const cursor = new Cursor(_.id('editor'));

download(_.id('download'), _.id('editor'));

if(!Object.keys(patterns).includes(language)) language = 'generic';

for(const child of _.id('editor').children){
    new PrismCustom(child, language).ApplyWithCaret();
}

document.getElementById('option-language').addEventListener('change', e => {
    language = e.target.value.toLowerCase();
    for(const child of document.getElementById('editor').children){
        new PrismCustom(child, language).ApplyWithCaret();
    }
    socket.send('language', {language});
});

document.addEventListener('socket.receive.language', e => {
    if(Object.keys(patterns).includes(e.detail.language.toLowerCase())){
        language = e.detail.language.toLowerCase();

        for(const child of document.getElementById('editor').children){
            new PrismCustom(child, language).ApplyWithCaret();
        }

        document.getElementById('option-language').value = language;
    }
});

for(const lang of Object.keys(patterns)){
    const option = document.createElement('option');
    option.innerText = lang;
    if(lang === language) option.selected = true;
    document.getElementById('option-language').appendChild(option);
}

document.getElementById('option-space-size').addEventListener('change', e => {
    editor.tab.setSize(e.target.value);

    for(const child of document.getElementById('editor').children){
        child.innerText = editor.tab.updateText(child.innerText);
        new PrismCustom(child, language).apply();
    }
});
