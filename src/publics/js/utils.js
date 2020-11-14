/* https://jsfiddle.net/nrx9yvw9/5/ */
export function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                 range.setEnd(node, chars.count);
                 chars.count = 0;
            }
        } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                   break;
                }
            }
        }
   }

   return range;
}

export function setCurrentCursorPosition(element, chars) {
    if (chars >= 0) {
        let selection = document.getSelection();

        let range = createRange(element, { count: chars });

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

/* Based of https://stackoverflow.com/a/4812022/11247647 */
export function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = win.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type !== "Control") {
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

export function getCaretCharacterStartOffset(element) {
    let caretOffset = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = win.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type !== "Control") {
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

export function getCurrentElement(){
    return window.getSelection().getRangeAt(0).startContainer;
}

export function get_uuid_element(child=getCurrentElement()){
    try{
        if(child.nodeType !== Node.TEXT_NODE && child.hasAttribute('uuid')) return child;
        else return get_uuid_element(child.parentElement);
    }catch (e){
        return undefined;
    }
}

export function getDivOrSectionParent(child=getCurrentElement()){
    if(child.nodeName === "DIV" || child.nodeName === "SECTION") return child;
    else return getDivOrSectionParent(child.parentElement);
}

export function triggerEvent(name, request){
    document.dispatchEvent(new CustomEvent(name, {detail: {request}}));
}

export function triggerMultipleEvent(name, requests){
    document.dispatchEvent(new CustomEvent(name, {detail: {requests}}));
}

export function htmlEncode(str){
  return String(str).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
