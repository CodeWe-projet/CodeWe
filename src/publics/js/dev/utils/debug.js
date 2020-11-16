/**
 * This module deals with debugging.
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.0
 */
import Config from "/js/dev/config.js";
import DateStyle from "/js/dev/utils/dateStyle.js";

export const LEVEL = {
    DEBUG: [console.log],
    INFO : [console.info],
    LOG: [console.log],
    WARN: [console.warn],
    ERROR: [console.error],
    CRITICAL: [console.error]
}

export default class Debug{
    static history = new Map();

    /**
     * Check if debugging is on
     * @return {boolean}
     */
    static has(){
        return Config.DEBUG;
    }

    /**
     * Set a new debug entry
     * @param {[(...data: any[]) => void]} level
     * @param {*} data
     */
    static entry(level, ...data){
        const date = DateStyle.full();
        Debug.history.set(data, ...data);
        if(Debug.has() || level === LEVEL.ERROR || level === LEVEL.CRITICAL){
            for(const fct of level){
                fct(date, ' - ', ...data);
            }
        }
    }

    static debug(...data){
        Debug.entry(LEVEL.DEBUG, ...data);
    }

    static info(...data){
        Debug.entry(LEVEL.INFO, ...data);
    }

    static log(...data){
        Debug.entry(LEVEL.LOG, ...data);
    }

    static warn(...data){
        Debug.entry(LEVEL.WARN, ...data);
    }

    static error(...data){
        Debug.entry(LEVEL.ERROR, ...data);
    }

    static critical(...data){
        Debug.entry(LEVEL.CRITICAL, ...data);
    }
}
