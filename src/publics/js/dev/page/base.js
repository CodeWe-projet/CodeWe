import Welcome from "../component/welcome.js";
import _ from "../utils/element.js";
/**
 * This module is the base script of all pages.
 * @author Brieuc Dubois
 * @date 14/11/2020
 * @version 1.0.0
 */

// Display Welcome Message is new user
new Welcome(_.id('welcome-button'));
