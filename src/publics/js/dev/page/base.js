/**
 * This module is the base script of all pages.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */
import Welcome from "/js/dev/component/welcome.js";
import _ from "/js/dev/utils/element.js";

// Display Welcome Message is new user
new Welcome(_.id('welcome-button'));
