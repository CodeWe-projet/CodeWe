/**
 * This module deals with KeyCode values.
 * @author Brieuc Dubois
 * @date Created on 15/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.0
 */

/**
 * Set href of link to download content of source
 * @param {HTMLElement} link
 * @param {HTMLElement} source
 */
export default function setDownloadButton(link, source){
    link.addEventListener('click', () => {
        const content = source.innerText.replaceAll('\n\n', '\n');
        link.setAttribute(
            'href',
            'data:Content-type, ' + escape(content)
        )
    });
}
