/**
 * This module deals with getting current specifications for debugging.
 * @author Brieuc Dubois
 * @date Created on 18/11/2020
 * @date Last modification on 19/11/2020
 * @version 1.0.0
 */

export default class Specifications{
    /**
     * Get information about current implementation
     */
    static user() {
        return {
            general: {
                languages: navigator.languages,
            },
            navigator: {
                userAgent: navigator.userAgent,
                appCodeName: navigator.appCodeName,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                buildId: navigator.buildID,
                doNotTrack: navigator.doNotTrack,
                plugins: Specifications.plugins(),
            },
            services:{
                websocket: Boolean(window.WebSocket),
                cookieEnabled: navigator.cookieEnabled,
            },
            system: {
                oscpu: navigator.oscpu,
                platform: navigator.platform,
            },
            screen: {
                resolution: screen.width + 'x' + screen.height,
                color_depth: screen.colorDepth + ' bits',
                window: window.innerWidth + 'x' + window.innerHeight,
            },
        }
    }

    /**
     * Get list of plugins
     * @return {{}}
     */
    static plugins(){
        let res = {};
        for (let i = 0; i < navigator.plugins.length; i++){
            const plugin = navigator.plugins[i];

            if (plugin) {
                res[plugin.name] = plugin.description;
            }
        }
        return res;
    }
}
