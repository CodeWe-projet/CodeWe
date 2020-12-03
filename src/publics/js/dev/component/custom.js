/**
 * Tab customization
 */

import {editor, socket} from "/js/dev/page/editor.js";
import {patterns} from "/js/dev/page/editor/prism/patterns.js";
import PrismCustom from "/js/dev/page/editor/prism/prismCustom.js";

export default class Customize{
    /** Init the customize object
     * @param {Editable} editable
     */
    constructor(editable) {
        this.editable = editable;

        document.getElementById('option-language').addEventListener('change', e => {
            language = e.target.value.toLowerCase();
            this.editable.updateAllHighlighting();
            socket.send('language', {language});
        });

        document.addEventListener('socket.receive.language', e => {
            if(Object.keys(patterns).includes(e.detail.language.toLowerCase())){
                language = e.detail.language.toLowerCase();
                document.getElementById('option-language').value = language;
                this.editable.updateAllHighlighting();
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

            for(const child of this.editable.editable.children){
                child.innerText = editor.tab.updateText(child.innerText);
                new PrismCustom(child, language).apply();
            }

            socket.send('changeTabSize', {size: e.target.value});
        });

        document.getElementById('option-space-size').value = this.editable.tab.size;

        document.addEventListener('socket.receive.changeTabSize', e => {
            if(e.detail.size && Number.isInteger(parseInt(e.detail.size))){
                editor.tab.setSize(e.detail.size);
                document.getElementById('option-space-size').value = e.detail.size;

                for(const child of this.editable.editable.children){
                    child.innerText = editor.tab.updateText(child.innerText);
                    new PrismCustom(child, language).apply();
                }
            }
        });
    }
}
