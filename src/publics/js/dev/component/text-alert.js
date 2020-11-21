/**
 * This component deals with cards alerts.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 14/11/2020
 * @version 1.0.0
 */

import Random from "/js/dev/utils/random.js";

/**
 * Create temporary card on the top right of screen
 * @param {string} title
 * @param {string} message
 * @param {number} duration
 * @param {string} color
 */
export default function temporaryCardAlert(title, message, duration, color='#1e90ff'){
    const id = Random.string(11);
    const card = document.createElement('div');
    card.classList.add('alertCard');
    card.style.backgroundColor = color;
    card.id = id;
    card.innerHTML = "<h3>" + title + "</h3><p>" + message + "</p>";
    document.getElementById('body').appendChild(card);

    setTimeout(() => {
        card.remove();
    }, duration);
}
