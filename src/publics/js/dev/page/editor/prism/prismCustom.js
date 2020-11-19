import {patterns} from "/js/dev/page/editor/prism/patterns.js";
import {Prism} from "/js/dev/page/editor/prism/prism.js";
import Caret from "/js/dev/utils/caret.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import {getNodeFromAttribute} from "/js/dev/utils/element.js";
import {htmlEncode} from "/js/dev/utils/string.js";

export default class PrismCustom{
    constructor(element, lang) {
        this.element = element;
        this.lang = lang;
        this.pattern = patterns[lang].concat(patterns['generic']);
    }

    setLang(lang){
        this.lang = lang;
        this.pattern = patterns[lang] | this.pattern;
    }

    getLang(){
        return this.lang;
    }

    getElement(){
        return this.element;
    }

    getPattern(){
        return this.pattern;
    }

    apply(){
        const prismInstance = new Prism(this.pattern);
        this.element.innerHTML = prismInstance.refract(htmlEncode(this.element.innerText)).replaceAll('\n', '');
        if(this.element.innerHTML.replaceAll('\n', '') === '') this.element.innerHTML = '<br>';
    }

    ApplyWithCaret(){
        const offset = Caret.getBeginPosition(this.element);

        this.apply();

        Caret.setPosition(this.element, offset);
    }

    /**
     * Build a PrismCustom object on the current uuid node
     * @constructor
     * @param {string} lang
     * @return {PrismCustom}
     */
    static onCurrent(lang){
        return new PrismCustom(getNodeFromAttribute('uuid'), lang);
    }
}
