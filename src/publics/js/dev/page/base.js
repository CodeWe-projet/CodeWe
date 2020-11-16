/**
 * This module is the base script of all pages.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */
import Welcome from "/js/dev/component/welcome.js";
import Debug from "/js/dev/utils/debug.js";
import _ from "/js/dev/utils/element.js";
import Socket from "/js/dev/utils/websocket/socket.js";

// Display Welcome Message is new user
new Welcome(_.id('welcome-button'));

const socket = new Socket({
    secure: false,
    port: window.location.port,
    hostname: window.location.origin,
    pathname: 'ws',
});

document.getElementById('link-welcome').onclick = Welcome.show;

document.getElementById('link-report').onclick = () => {
    socket.send({
        'event': 'report',
        'data': {
            'content': 'I can\'t remove default code: I have an error message.'
        }
    })
}
