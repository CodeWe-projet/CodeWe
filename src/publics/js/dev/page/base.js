/**
 * This module is the base script of all pages.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 17/11/2020
 * @version 2.0.0
 */
import Welcome from "/js/dev/component/welcome.js";
import _ from "/js/dev/utils/element.js";
import Socket from "/js/dev/utils/websocket/socket.js";
// import {jwtDecode} from "/js/dev/jwt-decode.js";

// Display Welcome Message is new user
new Welcome(_.id('welcome-button'));

document.getElementById('link-welcome').onclick = Welcome.show;

document.getElementById('link-report').onclick = () => {
    document.getElementById('report-issue').style.display = "block";
    document.getElementById('main').classList.add("blur-background");
};

document.getElementById('reported').addEventListener('click', e => {
    document.getElementById('report-issue').style.display = "none";
    document.getElementById('main').classList.remove("blur-background");
});



/*
let token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjEzOTMyODY4OTMsImlhdCI6MTM5MzI2ODg5M30.4-iaDojEVl0pJQMjrbM1EzUIfAZgsbK_kgnVyVxFSVo";
let decoded = jwtDecode(token);
Debug.debug(JSON.stringify(
    decoded,
    null,
    4
));
*/
