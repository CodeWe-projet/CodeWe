import {patterns} from "./patterns.js";
import {getCaretCharacterOffsetWithin, setCurrentCursorPosition, htmlEncode} from "../../utils.js";
import {Prism} from "./prism.js";


export class PrismCustom{
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
        this.element.innerHTML = prismInstance.refract(htmlEncode(this.element.innerText));
    }

    ApplyWithCaret(){
        const offset = getCaretCharacterOffsetWithin(this.element);

        this.apply();

        setCurrentCursorPosition(this.element, offset);
    }
}